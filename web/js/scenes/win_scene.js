/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, Map, Movable, Divo, Pacman, GameData */

/**
 * You win scene.
 */
function WinScene() {
    console.log("WinScene created");
}

WinScene.prototype = new Scene();

WinScene.prototype.release = function () {
    console.log("WinScene release() called");
};

WinScene.prototype.handleKey = function (e) {
};

WinScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var context = game.getContext();
    context.font = "bold 64px serif";
    context.fillStyle = "#80ff80";
    context.textAlign = "center";
    context.fillText("You Win", game.getScreenWidth() / 2, game.getScreenHeight() / 2);

    this.computeFPS();
};

