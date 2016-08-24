/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, SCENE_TITLE */

/**
 * Game over scene.
 */
function GameOverScene() {
    console.log("GameOverScene created");
}

GameOverScene.prototype = new Scene();

GameOverScene.prototype.release = function () {
    console.log("GameOverScene release() called");
};

GameOverScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(SCENE_TITLE);
    }
};

GameOverScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var context = game.getContext();
    context.font = "bold 64px serif";
    context.fillStyle = "#ff0000";
    context.textAlign = "center";
    context.fillText("Game Over", game.getScreenWidth() / 2, game.getScreenHeight() / 2);

    this.computeFPS();
};

