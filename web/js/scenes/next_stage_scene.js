/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, Map, Movable, Divo, Pacman, GameData */

/**
 * Next stage scene.
 */
function NextStageScene() {
    console.log("NextStageScene created");
}

NextStageScene.prototype = new Scene();

NextStageScene.prototype.release = function () {
    console.log("NextStageScene release() called");
};

NextStageScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (GameData.instance().nextStage())
        Game.instance().changeScene(Game.SCENE_STAGE);
    else
        Game.instance().changeScene(Game.SCENE_WIN);

    this.computeFPS();
};

