/* global Game, Shader */

function TextureShader() {
}

TextureShader.prototype = new Shader();

TextureShader.prototype.init = function (gl) {
    var vertexSourceCode = ""
            + "attribute vec3 aVertexPosition;\n"
            + "attribute vec2 aTextureCoord;\n"
            + "uniform mat4 uMVPMatrix;\n"
            + "uniform mat4 uPMatrix;\n"
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
            + "  //if (gl_FragColor < 0.5) discard;\n"
            + "}\n";

    this.load(gl, vertexSourceCode, fragmentSourceCode);

    return true;
};

