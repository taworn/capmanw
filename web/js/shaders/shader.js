/* global Game */

/**
 * A shader program.
 */
function Shader() {
    this.program = null;
}

/**
 * Initializes shader programs.
 * @param gl A OpenGL context.
 * @param vertexSourceCode   A vertex shader source code.
 * @param fragmentSourceCode A fragment shader source code.
 * @return Returns true if successful, otherwise, it is false.
 */
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

/**
 * Loads shader program.
 * @param gl A OpenGL context.
 * @param shaderType A shader program type.
 * @param sourceCode A shader source code.
 */
Shader.prototype.loadShader = function (gl, shaderType, sourceCode) {
    var id = gl.createShader(shaderType);
    gl.shaderSource(id, sourceCode);
    gl.compileShader(id);
    return id;
};

/**
 * Uses this program.
 * @param gl A OpenGL context.
 */
Shader.prototype.useProgram = function (gl) {
    return gl.useProgram(this.program);
};

/**
 * Gets this program.
 */
Shader.prototype.getProgram = function () {
    return this.program;
};

