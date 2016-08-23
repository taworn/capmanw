/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, SCENE_TITLE, Map, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN, Movable, Divo, Pacman */

/**
 * Playing game scene.
 */
function PlayScene() {
    console.log("PlayScene created");

    var gl = Game.instance().getGL();
    this.imageMap = new Image();
    this.spriteMap = new Sprite(gl);
    this.imagePacman = new Image();
    this.spritePacman = new Sprite(gl);
    this.map = new Map();
    this.movDivoes = [new Divo(), new Divo(), new Divo(), new Divo()];
    this.movHero = new Pacman();
    this.timeStart = performance.now();

    var self = this;
    this.imageMap.onload = function () {
        self.spriteMap.bind(self.imageMap, 2, 2);
    };
    this.imagePacman.onload = function () {
        self.spritePacman.bind(self.imagePacman, 8, 8);
    };
    this.imageMap.src = "./res/map.png";
    this.imagePacman.src = "./res/pacman.png";

    this.map.load();
    for (var i = 0; i < 4; i++) {
        this.movDivoes[i].setId(i);
        this.movDivoes[i].setMap(this.map);
    }
    this.movHero.setMap(this.map);

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

PlayScene.prototype = new Scene();

PlayScene.prototype.release = function () {
    console.log("PlayScene release() called");
    this.spritePacman.release();
    this.spriteMap.release();
};

PlayScene.prototype.handleKey = function (e) {
    if (e.keyCode === 32) {
        console.log("key SPACE");
    }
    else if (e.keyCode === 65 || e.keyCode === 37) {
        console.log("key A or LEFT");
        this.movHero.move(MOVE_LEFT);
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {
        console.log("key D or RIGHT");
        this.movHero.move(MOVE_RIGHT);
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        console.log("key W or UP");
        this.movHero.move(MOVE_UP);
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        console.log("key S or DOWN");
        this.movHero.move(MOVE_DOWN);
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

    if (this.spritePacman.isLoaded()) {
        // sets timing
        var timeUsed = Math.floor(performance.now() - this.timeStart);
        this.timeStart = performance.now();
        //console.log("used " + timeUsed + " ms");
        this.movDivoes[0].play(timeUsed);
        this.movDivoes[1].play(timeUsed);
        this.movDivoes[2].play(timeUsed);
        this.movDivoes[3].play(timeUsed);
        this.movHero.play(timeUsed);

        // drawing map
        var scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(1.0, 1.0, 1.0));
        this.map.draw(this.spriteMap, this.viewProjectMatrix, scaleMatrix);

        // drawing movables
        scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vec3.fromValues(0.0625, 0.0625, 1.0));
        this.movDivoes[0].draw(this.spritePacman, this.viewProjectMatrix, scaleMatrix);
        this.movDivoes[1].draw(this.spritePacman, this.viewProjectMatrix, scaleMatrix);
        this.movDivoes[2].draw(this.spritePacman, this.viewProjectMatrix, scaleMatrix);
        this.movDivoes[3].draw(this.spritePacman, this.viewProjectMatrix, scaleMatrix);
        this.movHero.draw(this.spritePacman, this.viewProjectMatrix, scaleMatrix);

        // checks idling
        for (var i = 0; i < 4; i++) {
            if (this.movDivoes[i].isIdle())
                this.movDivoes[i].nextMove();
        }
    }

    this.computeFPS();
};

