/* global mat4, vec3, Game, Sprite, Animation, Map, GameData */

/**
 * A movable class.
 */
function Movable() {
    // just keep as comment due to bug inheritance
    /*
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
     */
}

Movable.MOVE_LEFT = 1;
Movable.MOVE_RIGHT = 2;
Movable.MOVE_UP = 4;
Movable.MOVE_DOWN = 8;

Movable.ACTION_LEFT = 0;
Movable.ACTION_RIGHT = 1;
Movable.ACTION_UP = 2;
Movable.ACTION_DOWN = 3;
Movable.ACTION_REVERSE_LEFT = 4;
Movable.ACTION_REVERSE_RIGHT = 5;
Movable.ACTION_REVERSE_UP = 6;
Movable.ACTION_REVERSE_DOWN = 7;
Movable.ACTION_DEAD_LEFT = 8;
Movable.ACTION_DEAD_RIGHT = 9;
Movable.ACTION_DEAD_UP = 10;
Movable.ACTION_DEAD_DOWN = 11;

Movable.TIME_PER_ANI_FRAME = 250;

/**
 * Moves by direction, use constant Map::MOVE_*.
 */
Movable.prototype.move = function (direction) {
    if (!this.dead) {
        if (!this.animating) {
            var pf = {x: 0, y: 0};

            if (!GameData.instance().isReverseMode()) {
                if (direction === Movable.MOVE_LEFT)
                    this.animation.use(Movable.ACTION_LEFT);
                else if (direction === Movable.MOVE_RIGHT)
                    this.animation.use(Movable.ACTION_RIGHT);
                else if (direction === Movable.MOVE_UP)
                    this.animation.use(Movable.ACTION_UP);
                else if (direction === Movable.MOVE_DOWN)
                    this.animation.use(Movable.ACTION_DOWN);
            }
            else {
                if (direction === Movable.MOVE_LEFT)
                    this.animation.use(Movable.ACTION_REVERSE_LEFT);
                else if (direction === Movable.MOVE_RIGHT)
                    this.animation.use(Movable.ACTION_REVERSE_RIGHT);
                else if (direction === Movable.MOVE_UP)
                    this.animation.use(Movable.ACTION_REVERSE_UP);
                else if (direction === Movable.MOVE_DOWN)
                    this.animation.use(Movable.ACTION_REVERSE_DOWN);
            }

            if (this.map.canMove(this, direction, this.point, pf)) {
                this.distanceX = pf.x - this.animation.currentX;
                this.distanceY = pf.y - this.animation.currentY;
                this.targetX = pf.x;
                this.targetY = pf.y;
                this.currentDirection = direction;
                this.nextDirection = direction;
                this.timePerDistance = this.timePerMove;
                this.timeUsed = 0;
                this.animating = true;
            }
        }
        else {
            // for Pacman, use this for controller
            this.nextDirection = direction;
        }
    }
};

/**
 * Moves to (x, y) directly.
 */
Movable.prototype.moveDirect = function (p, pf) {
    this.distanceX = pf.x - this.animation.currentX;
    this.distanceY = pf.y - this.animation.currentY;
    this.targetX = pf.x;
    this.targetY = pf.y;
    this.timePerDistance = this.timePerDead;
    this.timeUsed = 0;
    this.animating = true;
};

/**
 * Chooses next action.  This function is called after play() is completed.
 */
Movable.prototype.nextAction = function () {
    if (!this.dead) {
        this.move(this.decision(this.nextDirection));
    }
};

/**
 * Plays animation after call move() or moveDirectly().
 */
Movable.prototype.play = function (timeUsed) {
    if (this.animating) {
        if (this.timeUsed + timeUsed < this.timePerDistance) {
            var dx = timeUsed * this.distanceX / this.timePerDistance;
            var dy = timeUsed * this.distanceY / this.timePerDistance;
            this.animation.moveBy(dx, dy);
            this.timeUsed += timeUsed;
        }
        else {
            this.animation.moveTo(this.targetX, this.targetY);
            this.animating = false;
            this.nextAction();
        }
    }
};

/**
 * Kills this movable.  Inherit class should derived this function.
 */
Movable.prototype.kill = function () {
    this.dead = true;
};

/**
 * Checks whether movable is dead.
 */
Movable.prototype.isDead = function () {
    return this.dead;
};

/**
 * Checks whether movable is busing or idling.
 */
Movable.prototype.isIdle = function () {
    return !this.dead && !this.animating;
};

/**
 * Sets map.  Used to bind Movable with Map.
 */
Movable.prototype.setMap = function (map) {
    this.map = map;
};

/**
 * Draws movable.
 */
Movable.prototype.draw = function (sprite, viewProjectMatrix, scaleMatrix) {
    var translateMatrix = mat4.create();
    var modelMatrix = mat4.create();
    var mvpMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.animation.currentX, this.animation.currentY, 0));
    mat4.multiply(modelMatrix, translateMatrix, scaleMatrix);
    mat4.multiply(mvpMatrix, viewProjectMatrix, modelMatrix);
    this.animation.draw(mvpMatrix, sprite);
};

/**
 * Chooses which action after animation is completed.
 */
Movable.prototype.decision = function (moveDirection) {
    return moveDirection;
};

