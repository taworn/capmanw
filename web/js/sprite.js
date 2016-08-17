/* global mat4, vec3, Game, TextureShader */

/**
 * A sprite class.
 * @param {type} gl
 * @returns {Sprite}
 */
function Sprite(gl) {
    this.gl = gl;
    this.shader = Game.instance().getTextureShader();
    this.verticesHandle = gl.createBuffer();
    this.indicesHandle = gl.createBuffer();
    this.textureHandle = gl.createTexture();
    this.uData = [];
    this.vData = [];
    this.sliceHorz = 0;
    this.sliceVert = 0;
    this.loaded = false;

    var indicesData = [
        // 1st triangle
        0, 1, 3,
        // 2nd triangle
        1, 2, 3
    ];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesHandle);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesData), gl.STATIC_DRAW);
}

/**
 * Releases all resources.
 */
Sprite.prototype.release = function () {
    var gl = Game.instance().getGL();
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.deleteTexture(this.textureHandle);
    gl.deleteBuffer(this.indicesHandle);
    gl.deleteBuffer(this.verticesHandle);
};

/**
 * Binds resources with image.
 */
Sprite.prototype.bind = function (image, sliceHorz, sliceVert, timeFrame) {
    var gl = this.gl;

    // binds texture and set pixels
    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    // sets sprite parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // sets sprite filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // loads, creates sprite and generates mipmaps
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.uData.length = 0;
    for (var i = 0; i <= sliceHorz; i++)
        this.uData.push(i / sliceHorz);
    this.vData.length = 0;
    for (var i = 0; i <= sliceVert; i++)
        this.vData.push(i / sliceVert);

    this.sliceHorz = sliceHorz;
    this.sliceVert = sliceVert;
    this.loaded = true;
};

/**
 * Draws sprite.
 */
Sprite.prototype.draw = function (mvpMatrix, imageIndex) {
    var gl = this.gl;
    this.shader.useProgram(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesHandle);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesHandle);

    // uses texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
    gl.uniform1i(this.shader.sampler, 0);

    var uIndex = Math.floor(imageIndex % this.sliceHorz);
    var vIndex = Math.floor(imageIndex / this.sliceHorz);
    var u0 = this.uData[uIndex];
    var u1 = this.uData[uIndex + 1];
    var v0 = this.vData[vIndex];
    var v1 = this.vData[vIndex + 1];

    var verticesData = [
        // vertex      // coord
        1.0, 1.0, 0.0, u1, v0,
        1.0, -1.0, 0.0, u1, v1,
        -1.0, -1.0, 0.0, u0, v1,
        -1.0, 1.0, 0.0, u0, v0
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesHandle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);

    // positions attribute
    gl.vertexAttribPointer(this.shader.position, 3, gl.FLOAT, gl.FALSE, 20, 0);
    gl.enableVertexAttribArray(this.shader.position);

    // sprite coordinates attribute
    gl.vertexAttribPointer(this.shader.coord, 2, gl.FLOAT, gl.FALSE, 20, 12);
    gl.enableVertexAttribArray(this.shader.coord);

    // drawing
    gl.uniformMatrix4fv(this.shader.mvpMatrix, false, mvpMatrix);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};

/**
 * Gets number of images.
 */
Sprite.prototype.getImageCount = function () {
    return this.sliceHorz * this.sliceVert;
};

/**
 * Checks if image is loaded or not.
 */
Sprite.prototype.isLoaded = function () {
    return this.loaded;
};

