/* global mat4, vec3 */

window.onload = function () {
    var game = new Game();
    game.go();
};

function Game() {
    this.canvas = document.getElementById('canvas');
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

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
    this.vertexShaderHandle = this.loadShader(this.gl.VERTEX_SHADER, vertexShader);
    this.fragmentShaderHandle = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    this.programHandle = this.gl.createProgram();
    if (this.programHandle) {
        this.gl.attachShader(this.programHandle, this.vertexShaderHandle);
        this.gl.attachShader(this.programHandle, this.fragmentShaderHandle);
        this.gl.bindAttribLocation(this.programHandle, 0, "a_Position");
        this.gl.bindAttribLocation(this.programHandle, 1, "a_Color");
        this.gl.linkProgram(this.programHandle);
    }
    this.mvpMatrixHandle = this.gl.getUniformLocation(this.programHandle, "u_MVPMatrix");
    this.positionHandle = this.gl.getAttribLocation(this.programHandle, "a_Position");
    this.colorHandle = this.gl.getAttribLocation(this.programHandle, "a_Color");
    this.gl.useProgram(this.programHandle);

    this.timeStart = performance.now();
    this.frameCount = 0;
}

Game.prototype.loadShader = function (shaderType, sourceCode) {
    var id = this.gl.createShader(shaderType);
    this.gl.shaderSource(id, sourceCode);
    this.gl.compileShader(id);
    return id;
};

Game.prototype.fps = function (currentTime) {
    this.frameCount++;
    var timeUsage = currentTime - this.timeStart;
    if (timeUsage > 1000) {
        var fps = this.frameCount * 1000 / timeUsage;
        this.timeStart = currentTime;
        this.frameCount = 0;
        console.log("FPS: " + fps);
    }
};

Game.prototype.init = function () {
    this.modelX = 0.0;
    this.modelY = 0.0;
    this.modelDx = 0.0;
    this.modelDy = 0.0;
    this.angle = 0.0;
    this.angleToPlus = 5.0;

    // generates buffer
    var verticesData = [
        // X, Y, Z, R, G, B, A
        -1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
        1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0
    ];
    this.verticesId = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticesId);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verticesData), this.gl.STATIC_DRAW);
};

Game.prototype.handleKey = function (e) {
    if (e.keyCode === 32) {
        console.log("key SPACE");
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        console.log("key W or UP");
        this.modelDy = -0.1;
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        console.log("key S or DOWN");
        this.modelDy = 0.1;
    }
    else if (e.keyCode === 65 || e.keyCode === 37) {
        console.log("key A or LEFT");
        this.modelDx = -0.1;
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {
        console.log("key D or RIGHT");
        this.modelDx = 0.1;
    }
    else if (e.keyCode === 13) {
        console.log("key ENTER");
    }
};

Game.prototype.render = function (currentTime) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // model matrix
    var translateMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX + this.modelDx, this.modelY + this.modelDy, 0));
    this.modelX += this.modelDx;
    this.modelY += this.modelDy;
    this.modelDx = 0.0;
    this.modelDy = 0.0;
    var rotateMatrix = mat4.create();
    mat4.rotate(rotateMatrix, rotateMatrix, this.angle * (Math.PI / 180), vec3.fromValues(0, 1, 0));
    this.angle += this.angleToPlus;
    if (this.angle > 89.0 || this.angle < -89.0)
        this.angleToPlus = -this.angleToPlus;
    //console.log("translateMatrix: " + mat4.str(translateMatrix));
    //console.log("rotateMatrix: " + mat4.str(rotateMatrix));

    // view matrix
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix
            , vec3.fromValues(0, 0, 1.5)
            , vec3.fromValues(0, 0, -5)
            , vec3.fromValues(0, 1, 0));
    //console.log("viewMatrix: " + mat4.str(viewMatrix));

    // projection matrix
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, -1.0, 25.0);
    //console.log("projectionMatrix: " + mat4.str(projectionMatrix));

    // combines model, view, projection matrices
    var mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, rotateMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
    //console.log("mvpMatrix: " + mat4.str(mvpMatrix));
    //console.log("");

    this.gl.enableVertexAttribArray(0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.verticesId);
    this.gl.vertexAttribPointer(this.positionHandle, 3, this.gl.FLOAT, false, 7 * 4, 0 * 4);
    this.gl.enableVertexAttribArray(this.positionHandle);
    this.gl.vertexAttribPointer(this.colorHandle, 4, this.gl.FLOAT, false, 7 * 4, 3 * 4);
    this.gl.enableVertexAttribArray(this.colorHandle);
    this.gl.uniformMatrix4fv(this.mvpMatrixHandle, false, mvpMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    this.gl.disableVertexAttribArray(0);

    this.fps(currentTime);

    var self = this;
    window.requestAnimationFrame(function () {
        self.render(performance.now());
    });
};

Game.prototype.go = function () {
    var self = this;
    window.addEventListener('keydown', function (e) {
        self.handleKey(e);
    });
    this.init();
    this.render();
};

