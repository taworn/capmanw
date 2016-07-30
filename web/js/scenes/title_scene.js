/* global mat4, vec3 */

function TitleScene() {
    console.log("TitleScene created");
}

TitleScene.prototype = new Scene();

TitleScene.prototype.finish = function () {
    console.log("finish() called");
};

TitleScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(new PlayScene());
    }
};

TitleScene.prototype.render = function (timeCurrent) {
    var gl = Game.instance().getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.fps(timeCurrent);
};

