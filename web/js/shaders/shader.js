/* global Game */

function Shader() {
    this.program = null;
}

Shader.prototype.load = function (gl, vertexSourceCode, fragmentSourceCode) {
    this.program = gl.createProgram();

    var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexSourceCode);
    var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentSourceCode);

    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    gl.detachShader(this.program, fragmentShader);
    gl.detachShader(this.program, vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    if (!gl.isProgram(this.program))
        return false;

    return true;
};

Shader.prototype.loadShader = function (gl, shaderType, sourceCode) {
    var id = gl.createShader(shaderType);
    gl.shaderSource(id, sourceCode);
    gl.compileShader(id);
    return id;
};

Shader.prototype.useProgram = function (gl) {
    return gl.useProgram(this.program);
};

