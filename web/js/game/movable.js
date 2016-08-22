/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Map, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN */

var TIME_PER_ANI_FRAME = 250;

/**
 * A movable class.
 */
function Movable() {
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
Movable.prototype.move = function (direction) {
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
 * After move animation completed, it's call this function.
 */
Movable.prototype.nextMove = function () {
    this.move(this.nextDirection);
};

/**
 * Moves with direction, use constant Map::MOVE_*.
 */
Movable.prototype.play = function (timeUsed) {
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
Movable.prototype.draw = function (sprite, viewProjectMatrix, scaleMatrix, scaleUp) {
    var translateMatrix = mat4.create();
    var modelMatrix = mat4.create();
    var mvpMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.animation.currentX, this.animation.currentY, 0));
    mat4.multiply(modelMatrix, translateMatrix, scaleMatrix);
    mat4.multiply(mvpMatrix, viewProjectMatrix, modelMatrix);
    this.animation.draw(mvpMatrix, sprite);
};

