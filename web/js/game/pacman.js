/* global mat4, vec3, Game, Sprite, Animation, Map, Movable, Divo, GameData */

/**
 * A pacman class.
 */
function Pacman() {
    this.point = {x: 0, y: 0};
    this.dead = false;
    this.animating = false;
    this.distanceX = 0.0;
    this.distanceY = 0.0;
    this.targetX = 0.0;
    this.targetY = 0.0;
    this.currentDirection = 0;
    this.nextDirection = 0;
    this.timePerMove = 200;
    this.timePerDead = 1000;
    this.timePerDistance = 0;
    this.timeUsed = 0;
    this.animation = new Animation();
    this.map = null;

    this.timePerDistance = 200;
    this.animation.add(Movable.ACTION_LEFT, 0, 2, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_RIGHT, 2, 4, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_UP, 4, 6, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_DOWN, 6, 8, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_REVERSE_LEFT, 0, 2, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_REVERSE_RIGHT, 2, 4, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_REVERSE_UP, 4, 6, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_REVERSE_DOWN, 6, 8, Animation.ON_END_CONTINUE, Movable.TIME_PER_ANI_FRAME);
    this.animation.add(Movable.ACTION_DEAD_DOWN, 60, 64, Animation.ON_END_HIDDEN, 500);
    this.animation.use(Movable.ACTION_LEFT);
}

Pacman.prototype = new Movable();

/**
 * Detects enemies within rectangle.
 */
Pacman.prototype.detect = function () {
    if (!this.isDead()) {
        var RANGE = 0.03125;
        var x = this.animation.currentX;
        var y = this.animation.currentY;
        var left = x - RANGE;
        var top = y + RANGE;
        var right = x + RANGE;
        var bottom = y - RANGE;
        var gameData = GameData.instance();
        var count = gameData.getDivoCount();
        var i = 0;
        var detected = false;

        while (i < count) {
            var divo = gameData.getDivo(i);
            var divoX = divo.animation.currentX;
            var divoY = divo.animation.currentY;
            if (!divo.isDead()) {
                if (left < divoX && top > divoY && divoX < right && divoY > bottom) {
                    detected = true;
                    break;
                }
            }
            i++;
        }

        if (detected) {
            if (!GameData.instance().isReverseMode()) {
                var divo = gameData.getDivo(i);
                divo.kill();
                console.log("eat Divo #" + i);
            }

            else {
                this.kill();
                console.log("Pacman dead");
            }
        }
    }
};

Pacman.prototype.play = function (timeUsed) {
    // ancestor function not work!
    // just copy code here for now
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

    if (this.isDead()) {
        if (this.animation.isEnded())
            Game.instance().changeScene(Game.SCENE_GAMEOVER);
    }
};

Pacman.prototype.kill = function () {
    // ancestor function not work!
    // just copy code here for now
    this.dead = true;

    this.animation.use(Movable.ACTION_DEAD_DOWN);
};

Pacman.prototype.setMap = function (map) {
    Movable.prototype.setMap(map);
    this.map = map;
    var pf = {x: 0, y: 0};
    this.map.getPacmanStartPosition(this.point, pf);
    this.animation.moveTo(pf.x, pf.y);
};

