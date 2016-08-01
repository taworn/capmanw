/* global mat4, vec3, Game */

function Scene() {
    console.log("Scene created");
}

Scene.prototype.init = function () {
    console.log("init() called");

    var game = Game.instance();
    this.context = game.getContext();
    this.gl = game.getGL();
    this.positionHandle = game.getPositionHandle();
    this.colorHandle = game.getColorHandle();
    this.mvpMatrixHandle = game.getMVPMatrixHandle();
    this.screenWidth = game.getScreenWidth();
    this.screenHeight = game.getScreenHeight();

    this.frameCount = 0;
    this.fps = 0;
    this.timeStart = performance.now();
};

Scene.prototype.finish = function () {
    console.log("finish() called");
};

Scene.prototype.getGL = function () {
    return this.gl;
};

Scene.prototype.getContext = function () {
    return this.context;
};

Scene.prototype.getPositionHandle = function () {
    return this.positionHandle;
};

Scene.prototype.getColorHandle = function () {
    return this.colorHandle;
};

Scene.prototype.getMVPMatrixHandle = function () {
    return this.mvpMatrixHandle;
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
};

Scene.prototype.drawFPS = function () {
    var context = this.getContext();
    context.font = "normal 24px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "right";
    context.fillText(this.getFPS(), this.getScreenWidth(), this.getScreenHeight());
};

Scene.prototype.handleKey = function (e) {
    console.log("key " + e.keyCode);
};

Scene.prototype.render = function () {
    var gl = this.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.computeFPS();
    this.drawFPS();
};

