/* global mat4, vec3, NormalShader, Game */

/**
 * A single game scene.
 */
function Scene() {
    console.log("Scene created");
}

/**
 * Initializes a game scene.
 */
Scene.prototype.init = function () {
    console.log("init() called");

    var game = Game.instance();
    this.context = game.getContext();
    this.gl = game.getGL();
    this.normalShader = game.getNormalShader();
    this.screenWidth = game.getScreenWidth();
    this.screenHeight = game.getScreenHeight();

    this.fps = 0;
    this.frameCount = 0;
    this.timeStart = performance.now();
};

/**
 * Uninitializes a game scene.
 */
Scene.prototype.finish = function () {
    console.log("finish() called");
};

/**
 * Computes current frames per second.
 */
Scene.prototype.computeFPS = function () {
    this.frameCount++;
    var timeCurrent = performance.now();
    var timeUsage = timeCurrent - this.timeStart;
    if (timeUsage > 1000) {
        this.fps = this.frameCount * 1000 / timeUsage;
        this.fps = this.fps.toFixed(4);
        this.timeStart = timeCurrent;
        this.frameCount = 0;
        console.log("FPS: " + this.fps);
    }

    var context = this.getContext();
    context.font = "normal 24px sans-serif";
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.textAlign = "right";
    context.fillText(this.getFPS(), this.getScreenWidth(), this.getScreenHeight());
};

/**
 * Called when user press keyboard.
 */
Scene.prototype.handleKey = function (e) {
    console.log("key " + e.keyCode);
};

/**
 * Called every render frame.
 */
Scene.prototype.render = function () {
    var gl = this.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.computeFPS();
};

Scene.prototype.getGL = function () {
    return this.gl;
};

Scene.prototype.getContext = function () {
    return this.context;
};

Scene.prototype.getNormalShader = function () {
    return this.normalShader;
};

Scene.prototype.getScreenWidth = function () {
    return this.screenWidth;
};

Scene.prototype.getScreenHeight = function () {
    return this.screenHeight;
};

Scene.prototype.getFPS = function () {
    return this.fps;
};

