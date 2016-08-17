/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation */

/**
 * A base game scene.
 */
function Scene() {
    console.log("Scene created");

    this.fps = 0;
    this.frameCount = 0;
    this.timeStart = performance.now();
}

/**
 * Releases game resources.
 */
Scene.prototype.release = function () {
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

    var game = Game.instance();
    var context = game.getContext();
    context.font = "normal 24px sans-serif";
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.textAlign = "right";
    context.fillText(this.fps, game.getScreenWidth(), game.getScreenHeight());
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
    var gl = Game.instance().getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.computeFPS();
};

