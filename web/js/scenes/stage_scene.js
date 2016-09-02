/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, Map, Movable, Divo, Pacman, GameData */

/**
 * Stage scene.
 */
function StageScene() {
    console.log("StageScene created");
    this.timeBegin = performance.now();
    this.timeUsed = 0;
    console.log("start stage " + GameData.instance().stage + 1);
}

StageScene.prototype = new Scene();

StageScene.prototype.release = function () {
    console.log("StageScene release() called");
};

StageScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(Game.SCENE_PLAY);
    }
};

StageScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var context = game.getContext();
    context.font = "bold 64px serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("Stage " + (GameData.instance().stage + 1), game.getScreenWidth() / 2, game.getScreenHeight() / 2);

    var timeUsed = Math.floor(performance.now() - this.timeBegin);
    this.timeBegin = performance.now();
    this.timeUsed += timeUsed;
    if (this.timeUsed >= 2000)
        Game.instance().changeScene(Game.SCENE_PLAY);

    this.computeFPS();
};

