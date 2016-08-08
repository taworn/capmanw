/* global Shader, Texture, Game */

function Texture(gl) {
    this.gl = gl;
    this.shader = Game.instance().getTextureShader();
    this.verticesId = gl.createBuffer();
    this.indicesId = gl.createBuffer();
    this.texture = gl.createTexture();
    this.image = null;
    this.loaded = false;

    var verticesData = [
        // [ositions   // texture coords
        1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0, 0.0, 0.0,
        -1.0, 1.0, 0.0, 0.0, 1.0
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);

    var indicesData = [
        // first triangle
        0, 1, 3,
        // second triangle
        1, 2, 3
    ];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesData), gl.STATIC_DRAW);
}

Texture.prototype.bind = function (image) {
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // sets our texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // sets texture filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // loads, creates texture and generates mipmaps
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
    this.loaded = true;
};

Texture.prototype.draw = function (mvpMatrix) {
    var gl = this.gl;
    this.shader.useProgram(gl);
    //gl.enable(gl.TEXTURE_2D);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(this.shader.getProgram(), "uSampler"), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesId);
    // position attribute
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 20, 0);
    gl.enableVertexAttribArray(0);
    // texture coordinate attribute
    gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 20, 12);
    gl.enableVertexAttribArray(1);
    
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shader.getProgram(), "uMVPMatrix"), false, mvpMatrix);

    // drawing
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesId);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};

Texture.prototype.get = function () {
    return this.texture;
};

Texture.prototype.isLoaded = function () {
    return this.loaded;
};

