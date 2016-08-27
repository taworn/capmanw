/* global mat4, vec3, Game, TextureShader */

/**
 * A texture class.
 * @param {type} gl
 * @returns {Texture}
 */
function Texture(gl) {
    this.gl = gl;
    this.verticesHandle = gl.createBuffer();
    this.indicesHandle = gl.createBuffer();
    this.textureHandle = gl.createTexture();
    this.image = null;
    this.loaded = false;

    var verticesData = [
        // positions   // texture coords
        1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0, 0.0, 0.0,
        -1.0, 1.0, 0.0, 0.0, 1.0
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesHandle);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);

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
Texture.prototype.release = function () {
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
Texture.prototype.bind = function (image) {
    var gl = this.gl;

    // binds texture and set pixels
    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // sets texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // sets texture filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // loads, creates texture and generates mipmaps
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.loaded = true;
};

/**
 * Draws texture.
 */
Texture.prototype.draw = function (mvpMatrix) {
    var gl = this.gl;
    var shader = Game.instance().getTextureShader();
    shader.useProgram(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesHandle);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesHandle);

    // uses texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
    gl.uniform1i(shader.sampler, 0);

    // positions attribute
    gl.vertexAttribPointer(shader.position, 3, gl.FLOAT, gl.FALSE, 20, 0);
    gl.enableVertexAttribArray(shader.position);

    // texture coordinates attribute
    gl.vertexAttribPointer(shader.coord, 2, gl.FLOAT, gl.FALSE, 20, 12);
    gl.enableVertexAttribArray(shader.coord);

    // drawing
    gl.uniformMatrix4fv(shader.mvpMatrix, false, mvpMatrix);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};

/**
 * Checks if image is loaded or not.
 */
Texture.prototype.isLoaded = function () {
    return this.loaded;
};

