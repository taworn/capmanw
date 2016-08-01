/* global mat4, vec3, Scene */

window.onload = function () {
    var game = new Game();
    game.go();
};

var SCENE_DEFAULT = 0;
var SCENE_TITLE = 1;
var SCENE_PLAY = 2;

function Game() {
    Game.singleton = this;

    this.canvasGraphics = document.getElementById('canvas0');
    this.gl = this.canvasGraphics.getContext('webgl') || this.canvasGraphics.getContext('experimental-webgl');
    this.gl.viewport(0, 0, this.canvasGraphics.width, this.canvasGraphics.height);

    this.canvasText = document.getElementById('canvas1');
    this.context = this.canvasText.getContext('2d');

    this.init();
    this.scene = new TitleScene();
    this.scene.init();
}

Game.prototype.handleKey = function (e) {
    this.scene.handleKey(e);
};

Game.prototype.render = function () {
    this.context.clearRect(0, 0, this.canvasText.width, this.canvasText.height);
    this.scene.render();
    var self = this;
    window.requestAnimationFrame(function () {
        self.render();
    });
};

Game.prototype.getGL = function () {
    return this.gl;
};

Game.prototype.getContext = function () {
    return this.context;
};

Game.prototype.getPositionHandle = function () {
    return this.positionHandle;
};

Game.prototype.getColorHandle = function () {
    return this.colorHandle;
};

Game.prototype.getMVPMatrixHandle = function () {
    return this.mvpMatrixHandle;
};

Game.prototype.getScreenWidth = function () {
    return this.canvasGraphics.width;
};

Game.prototype.getScreenHeight = function () {
    return this.canvasGraphics.height;
};

Game.prototype.changeScene = function (sceneId) {
    this.scene.finish();
    switch (sceneId) {
        case SCENE_TITLE:
            this.scene = new TitleScene();
            break;
        case SCENE_PLAY:
            this.scene = new PlayScene();
            break;
        case SCENE_DEFAULT:
        default:
            this.scene = new Scene();
            break;
    }
    this.scene.init();
};

Game.prototype.init = function () {
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
};

Game.prototype.loadShader = function (shaderType, sourceCode) {
    var id = this.gl.createShader(shaderType);
    this.gl.shaderSource(id, sourceCode);
    this.gl.compileShader(id);
    return id;
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

