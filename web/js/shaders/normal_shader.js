/* global Game, Shader */

function NormalShader() {
    this.position = -1;
    this.color = -1;
    this.mvpMatrix = null;
}

NormalShader.prototype = new Shader();

NormalShader.prototype.init = function (gl) {
    var vertexSourceCode = ""
            + "uniform mat4 u_MVPMatrix;  \n"  // A constant representing the combined model/view/projection matrix.
            + "attribute vec4 a_Position; \n"  // Per-vertex position information we will pass in.
            + "attribute vec4 a_Color;    \n"  // Per-vertex color information we will pass in.
            + "varying vec4 v_Color;      \n"  // This will be passed into the fragment shader.
            + "void main() {              \n"  //
            + "  v_Color = a_Color;       \n"  // Pass the color through to the fragment shader.  It will be interpolated across the triangle.
            + "  gl_Position = u_MVPMatrix\n"  // gl_Position is a special variable used to store the final position.
            + "              * a_Position;\n"  // Multiply the vertex by the matrix to get the final point in normalized screen coordinates.
            + "}                          \n";
    var fragmentSourceCode = ""
            + "precision mediump float; \n"  // Set the default precision to medium.  We don't need as high of a precision in the fragment shader.
            + "varying vec4 v_Color;    \n"  // This is the color from the vertex shader interpolated across the triangle per fragment.
            + "void main() {            \n"  //
            + "  gl_FragColor = v_Color;\n"  // Pass the color directly through the pipeline.
            + "}                        \n";

    this.load(gl, vertexSourceCode, fragmentSourceCode);

    this.position = gl.getAttribLocation(this.program, "a_Position");
    this.color = gl.getAttribLocation(this.program, "a_Color");
    this.mvpMatrix = gl.getUniformLocation(this.program, "u_MVPMatrix");
    return true;
};

