/* global mat4, vec3, Game, NormalShader, Scene, SCENE_PLAY */

function TitleScene() {
    console.log("TitleScene created");
}

TitleScene.prototype = new Scene();

TitleScene.prototype.init = function () {
    Scene.prototype.init();
    console.log("init() called");
};

TitleScene.prototype.finish = function () {
    console.log("finish() called");
    Scene.prototype.finish();
};

TitleScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(SCENE_PLAY);
    }
};

TitleScene.prototype.render = function () {
    var gl = this.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var context = this.getContext();

    context.font = "bold 128px serif";
    context.fillStyle = "#ffff80";
    context.textAlign = "center";
    context.fillText("Capman", this.getScreenWidth() / 2, this.getScreenHeight() / 2 - 128);

    context.font = "normal 32px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("Press ENTER to Start", this.getScreenWidth() / 2, this.getScreenHeight() / 2 + 256);

    this.computeFPS();
};

