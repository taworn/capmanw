/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, Map, Movable, Divo, Pacman, GameData */

/**
 * Title game scene.
 */
function TitleScene() {
    console.log("TitleScene created");

    var gl = Game.instance().getGL();
    this.image = new Image();
    this.imageUI = new Image();
    this.sprite = new Sprite(gl);
    this.spriteUI = new Sprite(gl);
    this.aniDivo = new Animation();
    this.aniHero = new Animation();

    var self = this;
    this.image.onload = function () {
        self.sprite.bind(self.image, 8, 8);
    };
    this.image.src = "./res/pacman.png";
    this.imageUI.onload = function () {
        self.spriteUI.bind(self.imageUI, 2, 2);
    };
    this.imageUI.src = "./res/ui.png";

    var TIME = 300;
    this.aniDivo.add(0, 8, 10, Animation.ON_END_CONTINUE, TIME);
    this.aniDivo.add(1, 10, 12, Animation.ON_END_CONTINUE, TIME);
    this.aniDivo.add(2, 12, 14, Animation.ON_END_CONTINUE, TIME);
    this.aniDivo.add(3, 14, 16, Animation.ON_END_CONTINUE, TIME);
    this.aniDivo.use(0);

    this.aniHero.add(0, 0, 2, Animation.ON_END_CONTINUE, TIME);
    this.aniHero.add(1, 2, 4, Animation.ON_END_CONTINUE, TIME);
    this.aniHero.add(2, 4, 6, Animation.ON_END_CONTINUE, TIME);
    this.aniHero.add(3, 6, 8, Animation.ON_END_CONTINUE, TIME);
    this.aniHero.use(0);

    this.modelX = 0.0;
    this.menuIndex = 0;

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

TitleScene.prototype = new Scene();

TitleScene.prototype.release = function () {
    console.log("TitleScene release() called");
    this.sprite.release();
};

TitleScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        if (this.menuIndex === 0) {
            GameData.instance().reset();
            Game.instance().changeScene(Game.SCENE_STAGE);
        }
        else if (this.menuIndex === 1)
            Game.instance().changeScene(Game.SCENE_STAGE);
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

TitleScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (this.sprite.isLoaded()) {
        var scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.1, 0.1, 1));
        var translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX, -0.1, 0));
        var mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewProjectMatrix);
        var tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniHero.draw(mvpMatrix, this.sprite);

        translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX - 0.2, -0.1, 0));
        mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewProjectMatrix);
        tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniDivo.draw(mvpMatrix, this.sprite);

        this.modelX -= 0.01;
        if (this.modelX < -1.0)
            this.modelX = 1.0;
    }

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

    var x = game.getScreenWidth() / 2;
    var y = game.getScreenHeight() / 2;
    var context = game.getContext();
    context.font = "bold 128px serif";
    context.fillStyle = "#ffff80";
    context.textAlign = "center";
    context.fillText("Capman", x, y - 128);
    context.font = "normal 32px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("Start", x, y + 32);
    context.fillText("Continue", x, y + 96);

    this.computeFPS();
};

