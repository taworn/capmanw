/* global mat4, vec3, Game, Sprite, Animation, Map, Movable, GameData */

/**
 * A divo class.
 */
function Divo() {
    this.point = {x: 0, y: 0};
    this.dead = false;
    this.animating = false;
    this.distanceX = 0.0;
    this.distanceY = 0.0;
    this.targetX = 0.0;
    this.targetY = 0.0;
    this.currentDirection = 0;
    this.nextDirection = 0;
    this.timePerMove = 250;
    this.timePerDead = 750;
    this.timePerDistance = 0;
    this.timeUsed = 0;
    this.animation = new Animation();
    this.map = null;
}

Divo.prototype = new Movable();

/**
 * Sets divo identifer, just used to distint animation's set.
 */
Divo.prototype.setId = function (divoId) {
    this.animation.add(Movable.ACTION_LEFT, (divoId + 1) * 8, (divoId + 1) * 8 + 2, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_RIGHT, (divoId + 1) * 8 + 2, (divoId + 1) * 8 + 4, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_UP, (divoId + 1) * 8 + 4, (divoId + 1) * 8 + 6, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_DOWN, (divoId + 1) * 8 + 6, (divoId + 1) * 8 + 8, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_DEAD, 56, 60, Movable.TIME_PER_ANI_FRAME);
    this.animation.use(Movable.ACTION_LEFT);
};

Divo.prototype.kill = function () {
    this.dead = true;
    this.animation.use(Movable.ACTION_DEAD);
    var p = {x: 0, y: 0};
    var pf = {x: 0, y: 0};
    this.map.getDivoStartPosition(p, pf);
    this.moveDirect(p, pf);
};

Divo.prototype.setMap = function (map) {
    this.map = map;
    var pf = {x: 0, y: 0};
    this.map.getDivoStartPosition(this.point, pf);
    this.animation.moveTo(pf.x, pf.y);
};

Divo.prototype.decision = function (moveDirection) {
    if (this.map.hasItem(this)) {
    }

    // checks directions can move
    var dirs = this.map.canPreviewMove(this);
    var count = 0;
    if ((dirs & Movable.MOVE_LEFT) === Movable.MOVE_LEFT)
        count++;
    if ((dirs & Movable.MOVE_RIGHT) === Movable.MOVE_RIGHT)
        count++;
    if ((dirs & Movable.MOVE_UP) === Movable.MOVE_UP)
        count++;
    if ((dirs & Movable.MOVE_DOWN) === Movable.MOVE_DOWN)
        count++;

    if (count <= 0)
        return moveDirection;
    else if (count === 1) {
        moveDirection = dirs;
        return moveDirection;
    }

    // if movable direction >= 2, deleted opposite direction
    if (count >= 2 && moveDirection) {
        var opposite = 0;
        if (moveDirection === Movable.MOVE_LEFT)
            opposite = Movable.MOVE_RIGHT;
        else if (moveDirection === Movable.MOVE_RIGHT)
            opposite = Movable.MOVE_LEFT;
        else if (moveDirection === Movable.MOVE_UP)
            opposite = Movable.MOVE_DOWN;
        else if (moveDirection === Movable.MOVE_DOWN)
            opposite = Movable.MOVE_UP;
        dirs &= ~opposite;
    }

    if (count <= 2) {
        if (!(moveDirection && (dirs & moveDirection) === moveDirection)) {
            var randoms = [];
            if ((dirs & Movable.MOVE_LEFT) === Movable.MOVE_LEFT)
                randoms[randoms.length] = Movable.MOVE_LEFT;
            if ((dirs & Movable.MOVE_RIGHT) === Movable.MOVE_RIGHT)
                randoms[randoms.length] = Movable.MOVE_RIGHT;
            if ((dirs & Movable.MOVE_UP) === Movable.MOVE_UP)
                randoms[randoms.length] = Movable.MOVE_UP;
            if ((dirs & Movable.MOVE_DOWN) === Movable.MOVE_DOWN)
                randoms[randoms.length] = Movable.MOVE_DOWN;
            var min = Math.ceil(0);
            var max = Math.floor(randoms.length - 1);
            var r = Math.floor(Math.random() * (max - min)) + min;
            moveDirection = randoms[r];
        }
    }
    else {
        var randoms = [];
        if (moveDirection) {
            randoms[randoms.length] = this.nextDirection;
            randoms[randoms.length] = this.nextDirection;
        }
        if ((dirs & Movable.MOVE_LEFT) === Movable.MOVE_LEFT)
            randoms[randoms.length] = Movable.MOVE_LEFT;
        if ((dirs & Movable.MOVE_RIGHT) === Movable.MOVE_RIGHT)
            randoms[randoms.length] = Movable.MOVE_RIGHT;
        if ((dirs & Movable.MOVE_UP) === Movable.MOVE_UP)
            randoms[randoms.length] = Movable.MOVE_UP;
        if ((dirs & Movable.MOVE_DOWN) === Movable.MOVE_DOWN)
            randoms[randoms.length] = Movable.MOVE_DOWN;
        var min = Math.ceil(0);
        var max = Math.floor(randoms.length - 1);
        var r = Math.floor(Math.random() * (max - min)) + min;
        moveDirection = randoms[r];
    }
    return moveDirection;
};

