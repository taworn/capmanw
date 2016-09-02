/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, Map, Movable, Divo, Pacman, GameData */

/**
 * Game over scene.
 */
function GameOverScene() {
    console.log("GameOverScene created");
    var gl = Game.instance().getGL();
    this.imageUI = new Image();
    this.spriteUI = new Sprite(gl);
    this.menuIndex = 0;

    var self = this;
    this.imageUI.onload = function () {
        self.spriteUI.bind(self.imageUI, 2, 2);
    };
    this.imageUI.src = "./res/ui.png";

    // combines matrices
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix
            , vec3.fromValues(0, 0, 1.5)
            , vec3.fromValues(0, 0, -5)
            , vec3.fromValues(0, 1, 0));
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, -1.0, 25.0);
    this.viewProjectMatrix = mat4.create();
    mat4.multiply(this.viewProjectMatrix, projectionMatrix, viewMatrix);
}

GameOverScene.prototype = new Scene();

GameOverScene.prototype.release = function () {
    console.log("GameOverScene release() called");
};

GameOverScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        if (this.menuIndex === 0)
            Game.instance().changeScene(Game.SCENE_STAGE);
        else if (this.menuIndex === 1)
            Game.instance().changeScene(Game.SCENE_TITLE);
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        this.menuIndex--;
        if (this.menuIndex < 0)
            this.menuIndex = 1;
        return true;
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        this.menuIndex++;
        if (this.menuIndex > 1)
            this.menuIndex = 0;
        return true;
    }
};

GameOverScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var x = game.getScreenWidth() / 2;
    var y = game.getScreenHeight() / 2;
    var context = game.getContext();
    context.font = "bold 64px serif";
    context.fillStyle = "#ff0000";
    context.textAlign = "center";
    context.fillText("Game Over", x, y - 96);

    context.font = "normal 32px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("Continue", x, y + 32);
    context.fillText("Restart", x, y + 96);

    if (this.spriteUI.isLoaded()) {
        var scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.03, 0.03, 1));

        if (this.menuIndex === 0) {
            var translateMatrix = mat4.create();
            mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(-0.16, -0.050, 0.0));
            var mvpMatrix = mat4.create();
            mat4.copy(mvpMatrix, this.viewProjectMatrix);
            var tempMatrix = mat4.create();
            mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
            this.spriteUI.draw(mvpMatrix, 1);
        }
        else {
            var translateMatrix = mat4.create();
            mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(-0.16, -0.220, 0.0));
            var mvpMatrix = mat4.create();
            mat4.copy(mvpMatrix, this.viewProjectMatrix);
            var tempMatrix = mat4.create();
            mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
            this.spriteUI.draw(mvpMatrix, 1);
        }
    }

    this.computeFPS();
};

