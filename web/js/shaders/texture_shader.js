/* global Game, Shader */

function TextureShader() {
}

TextureShader.prototype = new Shader();

TextureShader.prototype.init = function (gl) {
    var vertexSourceCode = ""
            + "attribute vec3 aVertexPosition;\n"
            + "attribute vec2 aTextureCoord;\n"
            + "uniform mat4 uMVPMatrix;\n"
            + "varying vec2 vTextureCoord;\n"
            + "void main(void) {\n"
            + "  gl_Position = uMVPMatrix * vec4(aVertexPosition, 1.0);\n"
            + "  vTextureCoord = aTextureCoord;\n"
            + "}\n";
    var fragmentSourceCode = ""
            + "precision mediump float;\n"
            + "varying vec2 vTextureCoord;\n"
            + "uniform sampler2D uSampler;\n"
            + "void main(void) {\n"
            + "  vec4 textureColor = texture2D(uSampler, vTextureCoord);\n"
            + "  gl_FragColor = vec4(textureColor.rgb, textureColor.a);\n"
            + "}\n";

    this.load(gl, vertexSourceCode, fragmentSourceCode);

    this.position = gl.getAttribLocation(this.program, "aVertexPosition");
    this.coord = gl.getAttribLocation(this.program, "aTextureCoord");
    this.mvpMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
    this.sampler = gl.getUniformLocation(this.program, "uSampler");
    return true;
};

