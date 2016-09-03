/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Scene, Map, Movable, Divo, Pacman, GameData */

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
    this.timeBegin = performance.now();

    var self = this;
    this.imageMap.onload = function () {
        self.spriteMap.bind(self.imageMap, 2, 2);
    };
    this.imagePacman.onload = function () {
        self.spritePacman.bind(self.imagePacman, 8, 8);
    };
    var i = GameData.instance().stage;
    this.imageMap.src = "./res/map" + (i % 2) + ".png";
    this.imagePacman.src = "./res/pacman.png";

    GameData.instance().clear();
    var s = "" + (i + 1);
    while (s.length < 2)
        s = "0" + s;
    var methodName = "stage" + s + "MapResource";
    this.map.load(window[methodName]());
    //this.map.load(debugMapResource());
    //this.map.load(test0MapResource());
    //this.map.load(test1MapResource());
    for (var i = 0; i < 4; i++) {
        this.movDivoes[i].setId(i);
        this.movDivoes[i].setMap(this.map);
        GameData.instance().addDivo(this.movDivoes[i]);
    }
    this.movHero.setMap(this.map);
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
        this.movHero.move(Movable.MOVE_LEFT);
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {
        console.log("key D or RIGHT");
        this.movHero.move(Movable.MOVE_RIGHT);
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        console.log("key W or UP");
        this.movHero.move(Movable.MOVE_UP);
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        console.log("key S or DOWN");
        this.movHero.move(Movable.MOVE_DOWN);
    }
};

PlayScene.prototype.render = function () {
    var game = Game.instance();
    var gl = game.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    if (this.spritePacman.isLoaded()) {
        // sets timing
        var timeUsed = Math.floor(performance.now() - this.timeBegin);
        this.timeBegin = performance.now();
        //console.log("used " + timeUsed + " ms");
        GameData.instance().update(timeUsed);
        this.movDivoes[0].play(timeUsed);
        this.movDivoes[1].play(timeUsed);
        this.movDivoes[2].play(timeUsed);
        this.movDivoes[3].play(timeUsed);
        this.movHero.play(timeUsed);
        this.movHero.detect();

        // combines matrices
        var viewMatrix = mat4.create();
        if (this.map.width > 16 || this.map.height > 16) {
            mat4.lookAt(viewMatrix
                    , vec3.fromValues(this.movHero.animation.currentX, this.movHero.animation.currentY, 1.5)
                    , vec3.fromValues(this.movHero.animation.currentX, this.movHero.animation.currentY, -5)
                    , vec3.fromValues(0, 1, 0));
        }
        else {
            mat4.lookAt(viewMatrix
                    , vec3.fromValues(0, 0, 1.5)
                    , vec3.fromValues(0, 0, -5)
                    , vec3.fromValues(0, 1, 0));
        }
        var projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, -1.0, 25.0);
        this.viewProjectMatrix = mat4.create();
        mat4.multiply(this.viewProjectMatrix, projectionMatrix, viewMatrix);

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
                this.movDivoes[i].nextAction();
        }
    }

    var context = game.getContext();
    context.font = "normal 32px sans-serif";
    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.fillText(GameData.instance().score, 0, 32);

    this.computeFPS();
};

