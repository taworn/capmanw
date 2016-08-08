/* global mat4, vec3, Game, NormalShader, textureShader, Scene, SCENE_PLAY */

/**
 * Title game scene.
 */
function TitleScene() {
    console.log("TitleScene created");
}

TitleScene.prototype = new Scene();

TitleScene.prototype.init = function () {
    Scene.prototype.init();
    console.log("init() called");
    this.image = new Image();
    this.texture = new Texture(this.gl);
    
    var self = this;
    this.image.onload = function () {
        self.texture.bind(self.image);
    };
    this.image.src = "./res/a.png";
};

TitleScene.prototype.finish = function () {
    console.log("finish() called");
    Scene.prototype.finish();
};

TitleScene.prototype.handleKey = function (e) {
    if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(SCENE_PLAY);
    }
};

TitleScene.prototype.render = function () {
    var gl = this.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    //var textureShader = Game.instance().getTextureShader();
    var translateMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(-0.5 * 4, 1 * 4, 0));
    var scaleMatrix = mat4.create();
    mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.25, 0.25, 1));
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix
            , vec3.fromValues(0, 0, 1.5)
            , vec3.fromValues(0, 0, -5)
            , vec3.fromValues(0, 1, 0));
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, -1.0, 25.0);
    var mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, scaleMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);

    if (this.texture.isLoaded()) {
        this.texture.draw(mvpMatrix);
    }

    var context = this.getContext();
    context.font = "bold 128px serif";
    context.fillStyle = "#ffff80";
    context.textAlign = "center";
    context.fillText("Capman", this.getScreenWidth() / 2, this.getScreenHeight() / 2 - 128);
    context.font = "normal 32px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.fillText("Press ENTER to Start", this.getScreenWidth() / 2, this.getScreenHeight() / 2 + 256);

    this.computeFPS();
};

