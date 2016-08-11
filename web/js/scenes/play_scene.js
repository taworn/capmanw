/* global mat4, vec3, Game, NormalShader, TextureShader, Scene, SCENE_TITLE */

/**
 * Playing game scene.
 */
function PlayScene() {
    console.log("PlayScene created");

    var gl = Game.instance().getGL();
    this.image = new Image();
    this.texture = new Texture(gl);

    var self = this;
    this.image.onload = function () {
        self.texture.bind(self.image);
    };
    this.image.src = "./res/a.png";

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
    mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, -1.0, 25.0);
    this.viewAndProjectMatrix = mat4.create();
    mat4.multiply(this.viewAndProjectMatrix, projectionMatrix, viewMatrix);
}

PlayScene.prototype = new Scene();

PlayScene.prototype.release = function () {
    console.log("PlayScene release() called");
    this.texture.release();
};

PlayScene.prototype.handleKey = function (e) {
    if (e.keyCode === 32) {
        console.log("key SPACE");
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        console.log("key W or UP");
        this.modelDx = 0.0;
        this.modelDy = 0.1;
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        console.log("key S or DOWN");
        this.modelDx = 0.0;
        this.modelDy = -0.1;
    }
    else if (e.keyCode === 65 || e.keyCode === 37) {
        console.log("key A or LEFT");
        this.modelDx = -0.1;
        this.modelDy = 0.0;
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {
        console.log("key D or RIGHT");
        this.modelDx = 0.1;
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

    if (this.texture.isLoaded()) {
        var translateMatrix = mat4.create();
        mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX, this.modelY, 0));
        if (this.modelDx > 0.0 && this.modelX < 8.0)
            this.modelX += this.modelDx;
        else if (this.modelDx < 0.0 && this.modelX > -8.0)
            this.modelX += this.modelDx;
        if (this.modelDy > 0.0 && this.modelY < 8.0)
            this.modelY += this.modelDy;
        else if (this.modelDy < 0.0 && this.modelY > -8.0)
            this.modelY += this.modelDy;
        var scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.2, 0.2, 1.0));
        var mvpMatrix = mat4.create();
        mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
        this.texture.draw(mvpMatrix);

        scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.1, 0.1, 1.0));
        for (var i = -18; i < 19; i += 2) {
            translateMatrix = mat4.create();
            mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(i, 18.0, 0));
            mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
            this.texture.draw(mvpMatrix);
        }
        for (var i = -18; i < 19; i += 2) {
            translateMatrix = mat4.create();
            mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(i, -18.0, 0));
            mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
            this.texture.draw(mvpMatrix);
        }
        for (var i = -18; i < 19; i += 2) {
            translateMatrix = mat4.create();
            mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(18.0, i, 0));
            mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
            this.texture.draw(mvpMatrix);
        }
        for (var i = -18; i < 19; i += 2) {
            translateMatrix = mat4.create();
            mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(-18.0, i, 0));
            mat4.copy(mvpMatrix, this.viewAndProjectMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
            mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
            this.texture.draw(mvpMatrix);
        }
    }

    this.computeFPS();
};

