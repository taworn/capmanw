/* global mat4, vec3, Game, NormalShader, TextureShader, Texture, Sprite, Animation, Map, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN, Movable, TIME_PER_ANI_FRAME */

/**
 * A pacman class.
 */
function Pacman() {
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

    this.timePerDistance = 200;
    this.animation.add(0, 0, 2, TIME_PER_ANI_FRAME);
    this.animation.add(1, 2, 4, TIME_PER_ANI_FRAME);
    this.animation.add(2, 4, 6, TIME_PER_ANI_FRAME);
    this.animation.add(3, 6, 8, TIME_PER_ANI_FRAME);
    this.animation.use(0);
}

Pacman.prototype = new Movable();

/**
 * Sets map.
 */
Pacman.prototype.setMap = function (map) {
    this.map = map;
    var pf = {x: 0, y: 0};
    this.map.getPacmanStartPosition(this.point, pf);
    this.animation.moveTo(pf.x, pf.y);
};

