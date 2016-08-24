/* global mat4, vec3, Shader, NormalShader, TextureShader, Scene */

window.onload = function () {
    var game = new Game();
    game.go();
};

var SCENE_DEFAULT = 0;
var SCENE_TITLE = 1;
var SCENE_STAGE = 2;
var SCENE_PLAY = 3;
var SCENE_GAMEOVER = 4;
var SCENE_WIN = 5;

/**
 * A simple game engine class.
 */
function Game() {
    Game.singleton = this;

    this.canvasGraphics = document.getElementById('canvas0');
    this.gl = this.canvasGraphics.getContext('webgl') || this.canvasGraphics.getContext('experimental-webgl');
    this.gl.viewport(0, 0, this.canvasGraphics.width, this.canvasGraphics.height);

    this.canvasText = document.getElementById('canvas1');
    this.context = this.canvasText.getContext('2d');

    this.normalShader = new NormalShader();
    this.normalShader.init(this.gl);

    this.textureShader = new TextureShader();
    this.textureShader.init(this.gl);

    this.scene = null;
    this.nextSceneId = SCENE_TITLE;
}

/**
 * Changes the new scene.
 * @param sceneId A scene identifier, look at SCENE_*.
 */
Game.prototype.changeScene = function (sceneId) {
    console.log("changeScene(), sceneId = " + sceneId);
    this.nextSceneId = sceneId;
};

/**
 * Performs real scene switching.
 */
Game.prototype.switchScene = function () {
    console.log("switchScene(), sceneId = " + this.nextSceneId);
    if (this.scene)
        this.scene.release();
    switch (this.nextSceneId) {
        default:
        case SCENE_DEFAULT:
            this.scene = new Scene();
            break;
        case SCENE_TITLE:
            this.scene = new TitleScene();
            break;
        case SCENE_STAGE:
            //this.scene = new StageScene();
            break;
        case SCENE_PLAY:
            this.scene = new PlayScene();
            break;
        case SCENE_GAMEOVER:
            this.scene = new GameOverScene();
            break;
        case SCENE_STAGE:
            //this.scene = new WinScene();
            break;
    }
    this.nextSceneId = -1;
};

/**
 * Called when user press keyboard.
 */
Game.prototype.handleKey = function (e) {
    if (this.scene)
        this.scene.handleKey(e);
};

/**
 * Called every render frame.
 */
Game.prototype.render = function () {
    if (this.nextSceneId < 0) {
        this.context.clearRect(0, 0, this.canvasText.width, this.canvasText.height);
        if (this.scene)
            this.scene.render();
    }
    else
        this.switchScene();

    var self = this;
    window.requestAnimationFrame(function () {
        self.render();
    });
};

Game.prototype.getGL = function () {
    return this.gl;
};

Game.prototype.getContext = function () {
    return this.context;
};

Game.prototype.getNormalShader = function () {
    return this.normalShader;
};

Game.prototype.getTextureShader = function () {
    return this.textureShader;
};

Game.prototype.getScreenWidth = function () {
    return this.canvasGraphics.width;
};

Game.prototype.getScreenHeight = function () {
    return this.canvasGraphics.height;
};

Game.prototype.go = function () {
    var self = this;
    window.addEventListener('keydown', function (e) {
        self.handleKey(e);
    });
    this.render(performance.now());
};

Game.instance = function () {
    return Game.singleton;
};

