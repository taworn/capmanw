/* global mat4, vec3 */

window.onload = function () {
    var game = new Game();
    game.go();
};

function Game() {
    Game.singleton = this;

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

    this.scene = new TitleScene();
}

Game.prototype.loadShader = function (shaderType, sourceCode) {
    var id = this.gl.createShader(shaderType);
    this.gl.shaderSource(id, sourceCode);
    this.gl.compileShader(id);
    return id;
};

Game.prototype.getGL = function () {
    return this.gl;
}

Game.prototype.getMVPMatrixHandle = function () {
    return this.mvpMatrixHandle;
};

Game.prototype.getPositionHandle = function () {
    return this.positionHandle;
};

Game.prototype.getColorHandle = function () {
    return this.colorHandle;
};

Game.prototype.currentScene = function () {
    return this.scene;
};

Game.prototype.changeScene = function (newScene) {
    this.scene.finish();
    this.scene = newScene;
};

Game.prototype.handleKey = function (e) {
    this.scene.handleKey(e);
};

Game.prototype.render = function (timeCurrent) {
    this.scene.render(timeCurrent);
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
    this.render(performance.now());
};

Game.instance = function () {
    return Game.singleton;
};

