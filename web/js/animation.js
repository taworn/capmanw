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
            onEnd: 0,
            time: 0
        };
    }
    this.currentPlaying = -1;
    this.currentImage = 0;
    this.ending = false;
    this.currentX = 0;
    this.currentY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.timeStart = performance.now();
}

Animation.ON_END_CONTINUE = 0;
Animation.ON_END_KEEP_LAST_FRAME = 1;
Animation.ON_END_HIDDEN = 2;

/**
 * Adds a playing animation, only 16 set allow.
 */
Animation.prototype.add = function (number, start, end, onEnd, time) {
    this.plays[number].start = start;
    this.plays[number].end = end;
    this.plays[number].onEnd = onEnd;
    this.plays[number].time = time;
};

/**
 * Uses a playing animation.
 */
Animation.prototype.use = function (number) {
    if (number !== this.currentPlaying) {
        this.currentPlaying = number;
        this.currentImage = this.plays[number].start;
        this.ending = false;
        this.timeStart = performance.now();
    }
};

/**
 * Draws animation.
 */
Animation.prototype.draw = function (mvpMatrix, sprite) {
    if (!this.ending) {
        sprite.draw(mvpMatrix, this.currentImage);

        var usage = performance.now() - this.timeStart;
        if (usage > this.plays[this.currentPlaying].time) {
            this.currentImage++;
            if (this.currentImage >= this.plays[this.currentPlaying].end) {
                switch (this.plays[this.currentPlaying].onEnd) {
                    default:
                    case Animation.ON_END_CONTINUE:
                        this.currentImage = this.plays[this.currentPlaying].start;
                        break;
                    case Animation.ON_END_KEEP_LAST_FRAME:
                        this.currentImage--;
                        this.ending = true;
                        break;
                    case Animation.ON_END_HIDDEN:
                        this.ending = true;
                        break;
                }
            }
            this.timeStart = performance.now();
        }
    }
    else {
        if (this.plays[this.currentPlaying].onEnd === Animation.ON_END_KEEP_LAST_FRAME)
            sprite.draw(mvpMatrix, this.currentImage);
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

Animation.prototype.setVelocity = function (dx, dy) {
    this.velocityX = dx;
    this.velocityY = dy;
};

Animation.prototype.playFrame = function (enableX, enableY) {
    if (enableX)
        this.currentX += this.velocityX;
    if (enableY)
        this.currentY += this.velocityY;
};

