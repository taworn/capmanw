/* global mat4, vec3 */

window.onload = function () {
    init();
};

function init() {
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    gl.viewport(0, 0, canvas.width, canvas.height);

    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var mvpMatrix = mat4.create();
    var mvpMatrixHandle = 0;
    var positionHandle = 0;
    var colorHandle = 0;
    var programHandle = 0;

    // vertex shader and fragment shader
    var vertexShader = ""
            + "uniform mat4 u_MVPMatrix;  \n"  // A constant representing the combined model/view/projection matrix.
            + "attribute vec4 a_Position; \n"  // Per-vertex position information we will pass in.
            + "attribute vec4 a_Color;    \n"  // Per-vertex color information we will pass in.
            + "varying vec4 v_Color;      \n"  // This will be passed into the fragment shader.
            + "void main() {              \n"  //
            + "  v_Color = a_Color;       \n"  // Pass the color through to the fragment shader.  It will be interpolated across the triangle.
            + "  gl_Position = u_MVPMatrix\n"  // gl_Position is a special variable used to store the final position.
            + "              * a_Position;\n"  // Multiply the vertex by the matrix to get the final point in normalized screen coordinates.
            + "}                          \n";
    var fragmentShader = ""
            + "precision mediump float; \n"  // Set the default precision to medium.  We don't need as high of a precision in the fragment shader.
            + "varying vec4 v_Color;    \n"  // This is the color from the vertex shader interpolated across the triangle per fragment.
            + "void main() {            \n"  //
            + "  gl_FragColor = v_Color;\n"  // Pass the color directly through the pipeline.
            + "}                        \n";
    var vertexShaderHandle = loadShader(gl, gl.VERTEX_SHADER, vertexShader);
    var fragmentShaderHandle = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    programHandle = gl.createProgram();
    if (programHandle) {
        gl.attachShader(programHandle, vertexShaderHandle);
        gl.attachShader(programHandle, fragmentShaderHandle);
        gl.bindAttribLocation(programHandle, 0, "a_Position");
        gl.bindAttribLocation(programHandle, 1, "a_Color");
        gl.linkProgram(programHandle);
    }
    mvpMatrixHandle = gl.getUniformLocation(programHandle, "u_MVPMatrix");
    positionHandle = gl.getAttribLocation(programHandle, "a_Position");
    colorHandle = gl.getAttribLocation(programHandle, "a_Color");
    gl.useProgram(programHandle);

    // generates buffer
    var verticesData = [
        // X, Y, Z, R, G, B, A
        -1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
        1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0
    ];
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);

    // timer
    var angle = 0.0;
    var angleToPlus = 1.0;
    var lastTick = 0;

    var draw = function (time) {
        if (time - lastTick > 1) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // model matrix
            modelMatrix = mat4.create();
            mat4.rotate(modelMatrix, modelMatrix, angle * (Math.PI / 180), vec3.fromValues(0, 1, 0));
            angle += angleToPlus;
            if (angle > 89.0 || angle < -89.0)
                angleToPlus = -angleToPlus;
            console.log("modelMatrix: " + mat4.str(modelMatrix));

            // view matrix
            mat4.lookAt(viewMatrix
                    , vec3.fromValues(0, 0, 1.5)
                    , vec3.fromValues(0, 0, -5)
                    , vec3.fromValues(0, 1, 0));
            console.log("viewMatrix: " + mat4.str(viewMatrix));

            // projection matrix
            mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, -1.0, 25.0);
            console.log("projectionMatrix: " + mat4.str(projectionMatrix));

            // combines model, view, projection matrices
            mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
            console.log("mvpMatrix: " + mat4.str(mvpMatrix));
            console.log("");

            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
            gl.vertexAttribPointer(positionHandle, 3, gl.FLOAT, false, 7 * 4, 0 * 4);
            gl.enableVertexAttribArray(positionHandle);
            gl.vertexAttribPointer(colorHandle, 4, gl.FLOAT, false, 7 * 4, 3 * 4);
            gl.enableVertexAttribArray(colorHandle);
            gl.uniformMatrix4fv(mvpMatrixHandle, false, mvpMatrix);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            gl.disableVertexAttribArray(0);

            lastTick = time;
        }
        window.requestAnimationFrame(draw);
    };
    draw(0);
}

function loadShader(gl, shaderType, sourceCode) {
    var id = gl.createShader(shaderType);
    gl.shaderSource(id, sourceCode);
    gl.compileShader(id);
    return id;
}

