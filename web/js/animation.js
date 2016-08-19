/* global mat4, vec3, Game, Sprite */

/**
 * An animation class.
 * @param {type} gl
 * @returns {Animation}
 */
function Animation() {
    this.plays = new Array();
    for (var i = 0; i < 16; i++) {
        this.plays[i] = {
            start: 0,
            end: 0,
            time: 0
        };
    }
    this.currentPlaying = -1;
    this.currentImage = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.timeStart = performance.now();
}

/**
 * Adds a playing animation, only 16 set allow.
 */
Animation.prototype.add = function (number, start, end, time) {
    this.plays[number].start = start;
    this.plays[number].end = end;
    this.plays[number].time = time;
};

/**
 * Uses a playing animation.
 */
Animation.prototype.use = function (number) {
    if (number !== this.currentPlaying) {
        this.currentPlaying = number;
        this.currentImage = this.plays[number].start;
        this.timeStart = performance.now();
    }
};

/**
 * Draws animation.
 */
Animation.prototype.draw = function (mvpMatrix, sprite) {
    sprite.draw(mvpMatrix, this.currentImage);

    var usage = performance.now() - this.timeStart;
    if (usage > this.plays[this.currentPlaying].time) {
        this.currentImage++;
        if (this.currentImage >= this.plays[this.currentPlaying].end)
            this.currentImage = this.plays[this.currentPlaying].start;
        this.timeStart = performance.now();
    }
};

Animation.prototype.moveTo = function (x, y) {
    this.currentX = x;
    this.currentY = y;
};

Animation.prototype.moveBy = function (dx, dy) {
    this.currentX += dx;
    this.currentY += dy;
};

Animation.prototype.setVelocity = function (x, y) {
    this.velocityX = x;
    this.velocityY = y;
};

Animation.prototype.playFrame = function (enableX, enableY) {
    if (enableX)
        this.currentX += this.velocityX;
    if (enableY)
        this.currentY += this.velocityY;
};

