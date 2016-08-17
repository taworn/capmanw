/* global mat4, vec3, Game, NormalShader, TextureShader, Scene, SCENE_TITLE */

/**
 * Playing game scene.
 */
function PlayScene() {
    console.log("PlayScene created");

    var gl = Game.instance().getGL();
    this.image = new Image();
    this.sprite = new Sprite(gl);
    this.aniHero = new Animation(this.sprite);
    this.aniDivoes = [
        new Animation(this.sprite),
        new Animation(this.sprite),
        new Animation(this.sprite),
        new Animation(this.sprite)
    ];

    var self = this;
    this.image.onload = function () {
        self.sprite.bind(self.image, 8, 8);
    };
    this.image.src = "./res/pacman.png";

    var TIME = 300;
    this.aniHero.add(0, 0, 2, TIME);
    this.aniHero.add(1, 2, 4, TIME);
    this.aniHero.add(2, 4, 6, TIME);
    this.aniHero.add(3, 6, 8, TIME);
    this.aniHero.use(0);

    for (var i = 0; i < 4; i++) {
        var j = (i + 1) * 8;
        this.aniDivoes[i].add(0, j + 0, j + 2, TIME);
        this.aniDivoes[i].add(1, j + 2, j + 4, TIME);
        this.aniDivoes[i].add(2, j + 4, j + 6, TIME);
        this.aniDivoes[i].add(3, j + 6, j + 8, TIME);
        this.aniDivoes[i].use(0);
    }

    this.modelX = 0.0;
    this.modelY = 0.0;
    this.modelDx = 0.0;
    this.modelDy = 0.0;

    // combines matrices
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix
            , vec3.fromValues(0, 0, 1.5)
            , vec3.fromValues(0, 0, -5)
            , vec3.fromValues(0, 1, 0));
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, -1.0, 25.0);
    this.viewAndProjectMatrix = mat4.create();
    mat4.multiply(this.viewAndProjectMatrix, projectionMatrix, viewMatrix);
}

PlayScene.prototype = new Scene();

PlayScene.prototype.release = function () {
    console.log("PlayScene release() called");
    this.sprite.release();
};

PlayScene.prototype.handleKey = function (e) {
    if (e.keyCode === 32) {
        console.log("key SPACE");
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        console.log("key W or UP");
        this.aniHero.use(2);
        this.modelDx = 0.0;
        this.modelDy = 0.02;
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        console.log("key S or DOWN");
        this.aniHero.use(3);
        this.modelDx = 0.0;
        this.modelDy = -0.02;
    }
    else if (e.keyCode === 65 || e.keyCode === 37) {
        console.log("key A or LEFT");
        this.aniHero.use(0);
        this.modelDx = -0.02;
        this.modelDy = 0.0;
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {
        console.log("key D or RIGHT");
        this.aniHero.use(1);
        this.modelDx = 0.02;
        this.modelDy = 0.0;
    }
    else if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(SCENE_TITLE);
    }
};

PlayScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (this.sprite.isLoaded()) {
        var scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.05, 0.05, 1.0));
        var translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX, this.modelY, 0));
        if (this.modelDx > 0.0 && this.modelX < 0.95)
            this.modelX += this.modelDx;
        else if (this.modelDx < 0.0 && this.modelX > -0.95)
            this.modelX += this.modelDx;
        if (this.modelDy > 0.0 && this.modelY < 0.95)
            this.modelY += this.modelDy;
        else if (this.modelDy < 0.0 && this.modelY > -0.95)
            this.modelY += this.modelDy;
        var mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        var tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniHero.draw(mvpMatrix);

        translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(-0.5, 0.5, 0));
        mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniDivoes[0].draw(mvpMatrix);

        translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(0.5, 0.5, 0));
        mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniDivoes[1].draw(mvpMatrix);

        translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(-0.5, -0.5, 0));
        mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniDivoes[2].draw(mvpMatrix);

        translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(0.5, -0.5, 0));
        mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        tempMatrix = mat4.create();
        mat4.multiply(tempMatrix, translateMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, tempMatrix);
        this.aniDivoes[3].draw(mvpMatrix);
    }

    this.computeFPS();
};

