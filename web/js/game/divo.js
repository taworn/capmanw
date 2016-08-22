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

/**
 * Moves with direction, use constant Map::MOVE_*.
 */
Divo.prototype.move = function (direction) {
    if (!this.walking) {
        var pf = {x: 0, y: 0};
        if (direction === MOVE_LEFT) {
            this.animation.use(0);
            if (this.map.canMove(this, direction, this.point, pf)) {
                this.distance = this.animation.currentX - pf.x;
                this.target = pf.x;
                this.currentDirection = direction;
                this.nextDirection = direction;
                this.timeUsed = 0;
                this.walking = true;
                //console.log("distance: " + this.distance + ", target: " + this.target);
            }
        }
        else if (direction === MOVE_RIGHT) {
            this.animation.use(1);
            if (this.map.canMove(this, direction, this.point, pf)) {
                this.distance = pf.x - this.animation.currentX;
                this.target = pf.x;
                this.currentDirection = direction;
                this.nextDirection = direction;
                this.timeUsed = 0;
                this.walking = true;
                //console.log("distance: " + this.distance + ", target: " + this.target);
            }
        }
        else if (direction === MOVE_UP) {
            this.animation.use(2);
            if (this.map.canMove(this, direction, this.point, pf)) {
                this.distance = pf.y - this.animation.currentY;
                this.target = pf.y;
                this.currentDirection = direction;
                this.nextDirection = direction;
                this.timeUsed = 0;
                this.walking = true;
                //console.log("distance: " + this.distance + ", target: " + this.target);
            }
        }
        else if (direction === MOVE_DOWN) {
            this.animation.use(3);
            if (this.map.canMove(this, direction, this.point, pf)) {
                this.distance = this.animation.currentY - pf.y;
                this.target = pf.y;
                this.currentDirection = direction;
                this.nextDirection = direction;
                this.timeUsed = 0;
                this.walking = true;
                //console.log("distance: " + this.distance + ", target: " + this.target);
            }
        }
    }
    else {
        this.nextDirection = direction;
    }
};

/**
 * Moves with direction, use constant Map::MOVE_*.
 */
Divo.prototype.play = function (timeUsed) {
    if (this.walking) {
        if (this.currentDirection === MOVE_LEFT) {
            if (this.timeUsed + timeUsed < this.timePerDistance) {
                var d = timeUsed * this.distance / this.timePerDistance;
                this.animation.moveBy(-d, 0);
                this.timeUsed += timeUsed;
            }
            else {
                this.animation.moveTo(this.target, this.animation.currentY);
                this.walking = false;
                this.nextMove();
            }
        }
        else if (this.currentDirection === MOVE_RIGHT) {
            if (this.timeUsed + timeUsed < this.timePerDistance) {
                var d = timeUsed * this.distance / this.timePerDistance;
                this.animation.moveBy(d, 0);
                this.timeUsed += timeUsed;
            }
            else {
                this.animation.moveTo(this.target, this.animation.currentY);
                this.walking = false;
                this.nextMove();
            }
        }
        else if (this.currentDirection === MOVE_UP) {
            if (this.timeUsed + timeUsed < this.timePerDistance) {
                var d = timeUsed * this.distance / this.timePerDistance;
                this.animation.moveBy(0, d);
                this.timeUsed += timeUsed;
            }
            else {
                this.animation.moveTo(this.animation.currentX, this.target);
                this.walking = false;
                this.nextMove();
            }
        }
        else if (this.currentDirection === MOVE_DOWN) {
            if (this.timeUsed + timeUsed < this.timePerDistance) {
                var d = timeUsed * this.distance / this.timePerDistance;
                this.animation.moveBy(0, -d);
                this.timeUsed += timeUsed;
            }
            else {
                this.animation.moveTo(this.animation.currentX, this.target);
                this.walking = false;
                this.nextMove();
            }
        }
    }
};

/**
 * Draws movable.
 */
Divo.prototype.draw = function (sprite, viewProjectMatrix, scaleMatrix, scaleUp) {
    var translateMatrix = mat4.create();
    var modelMatrix = mat4.create();
    var mvpMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.animation.currentX, this.animation.currentY, 0));
    mat4.multiply(modelMatrix, translateMatrix, scaleMatrix);
    mat4.multiply(mvpMatrix, viewProjectMatrix, modelMatrix);
    this.animation.draw(mvpMatrix, sprite);
};

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

