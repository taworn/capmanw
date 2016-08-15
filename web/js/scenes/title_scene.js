/* global mat4, vec3, Game, NormalShader, TextureShader, Scene, SCENE_PLAY */

/**
 * Title game scene.
 */
function TitleScene() {
    console.log("TitleScene created");

    var gl = Game.instance().getGL();
    this.image = new Image();
    this.sprite = new Sprite(gl);
    this.modelX = 0.0;

    var self = this;
    this.image.onload = function () {
        self.sprite.bind(self.image, 3, 2);
    };
    this.image.src = "./res/a.png";

    // combines matrices
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix
            , vec3.fromValues(0, 0, 1.5)
            , vec3.fromValues(0, 0, -5)
            , vec3.fromValues(0, 1, 0));
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, -1.0, 25.0);
    this.viewAndProjectMatrix = mat4.create();
    mat4.multiply(this.viewAndProjectMatrix, projectionMatrix, viewMatrix);
}

TitleScene.prototype = new Scene();

TitleScene.prototype.release = function () {
    console.log("TitleScene release() called");
    this.sprite.release();
};

TitleScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(SCENE_PLAY);
    }
};

TitleScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (this.sprite.isLoaded()) {
        var translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX, -0.7, 0));
        this.modelX -= 0.05;
        if (this.modelX < -5.5)
            this.modelX = 5.5;
        var scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.35, 0.35, 1));
        var mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
        this.sprite.draw(mvpMatrix, 1);
    }

    var context = game.getContext();
    context.font = "bold 128px serif";
    context.fillStyle = "#ffff80";
    context.textAlign = "center";
    context.fillText("Capman", game.getScreenWidth() / 2, game.getScreenHeight() / 2 - 128);
    context.font = "normal 32px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("Press ENTER to Start", game.getScreenWidth() / 2, game.getScreenHeight() / 2 + 256);

    this.computeFPS();
};

