/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Map, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN, Movable, TIME_PER_ANI_FRAME */

/**
 * A divo class.
 */
function Divo() {
    this.point = {x: 0, y: 0};
    this.walking = false;
    this.distance = 0;
    this.target = 0;
    this.currentDirection = 0;
    this.nextDirection = 0;
    this.timePerDistance = 350;
    this.timeUsed = 0;
    this.animation = new Animation();
    this.map = null;
}

Divo.prototype = new Movable();

/**
 * Sets divo identifer, just used to distint animation's set.
 */
Divo.prototype.setId = function (divoId) {
    this.animation.add(0, (divoId + 1) * 8, (divoId + 1) * 8 + 2, TIME_PER_ANI_FRAME);
    this.animation.add(1, (divoId + 1) * 8 + 2, (divoId + 1) * 8 + 4, TIME_PER_ANI_FRAME);
    this.animation.add(2, (divoId + 1) * 8 + 4, (divoId + 1) * 8 + 6, TIME_PER_ANI_FRAME);
    this.animation.add(3, (divoId + 1) * 8 + 6, (divoId + 1) * 8 + 8, TIME_PER_ANI_FRAME);
    this.animation.use(0);
};

/**
 * Sets map.
 */
Divo.prototype.setMap = function (map) {
    this.map = map;
    var pf = {x: 0, y: 0};
    this.map.getDivoStartPosition(this.point, pf);
    this.animation.moveTo(pf.x, pf.y);
};

/**
 * After move animation completed, it's call this function.
 */
Divo.prototype.nextMove = function () {
    var dirs = this.map.canPreviewMove(this);
    var count = 0;
    if ((dirs & MOVE_LEFT) === MOVE_LEFT)
        count++;
    if ((dirs & MOVE_RIGHT) === MOVE_RIGHT)
        count++;
    if ((dirs & MOVE_UP) === MOVE_UP)
        count++;
    if ((dirs & MOVE_DOWN) === MOVE_DOWN)
        count++;

    //console.log("dirs: " + dirs + ", count: " + count);
    if (count <= 0)
        return;

    else if (count === 1)
        this.nextDirection = dirs;

    else if (count === 2) {
        if (!(this.nextDirection && (dirs & this.nextDirection) === this.nextDirection)) {
            var randoms = [];
            if ((dirs & MOVE_LEFT) === MOVE_LEFT)
                randoms[randoms.length] = MOVE_LEFT;
            if ((dirs & MOVE_RIGHT) === MOVE_RIGHT)
                randoms[randoms.length] = MOVE_RIGHT;
            if ((dirs & MOVE_UP) === MOVE_UP)
                randoms[randoms.length] = MOVE_UP;
            if ((dirs & MOVE_DOWN) === MOVE_DOWN)
                randoms[randoms.length] = MOVE_DOWN;
            var min = Math.ceil(0);
            var max = Math.floor(randoms.length - 1);
            var r = Math.floor(Math.random() * (max - min)) + min;
            this.nextDirection = randoms[r];
            //console.log("count === 2, next: " + this.nextDirection);
        }
    }

    else {
        var randoms = [];
        if ((dirs & MOVE_LEFT) === MOVE_LEFT)
            randoms[randoms.length] = MOVE_LEFT;
        if ((dirs & MOVE_RIGHT) === MOVE_RIGHT)
            randoms[randoms.length] = MOVE_RIGHT;
        if ((dirs & MOVE_UP) === MOVE_UP)
            randoms[randoms.length] = MOVE_UP;
        if ((dirs & MOVE_DOWN) === MOVE_DOWN)
            randoms[randoms.length] = MOVE_DOWN;
        if (this.nextDirection)
            randoms[randoms.length] = this.nextDirection;
        var min = Math.ceil(0);
        var max = Math.floor(randoms.length - 1);
        var r = Math.floor(Math.random() * (max - min)) + min;
        this.nextDirection = randoms[r];
        //console.log("else, next: " + this.nextDirection);
    }

    this.move(this.nextDirection);
};

/**
 * Checks whether divo is walking or stand still.
 */
Divo.prototype.isIdle = function () {
    return !this.walking;
};

