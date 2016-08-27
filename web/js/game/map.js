/* global mat4, vec3, Game, Sprite, Animation, Movable */

/**
 * A map class.
 */
function Map() {
    this.width = 0;
    this.height = 0;
    this.mapData = null;
    this.imageData = null;
    this.itemCount = 0;
    this.horzBounds = [];
    this.horzPoints = [];
    this.vertBounds = [];
    this.vertPoints = [];
    this.startDivo = {x: 0, y: 0};
    this.startPacman = {x: 0, y: 0};
}

/**
 * Loads map data.
 */
Map.prototype.load = function () {
    var w = 16;
    var h = 16;
    this.width = w;
    this.height = h;
    this.mapData = [
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x01, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x10, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x00, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x10, 0x01,
        0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
    ];
    this.imageData = [
        0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03,
        0x03, 0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x03, 0x03, 0x00, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x03, 0x03, 0x00, 0x03, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x03, 0x03, 0x00, 0x03,
        0x03, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x03, 0x03, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x03, 0x00, 0x03, 0x03, 0x03, 0x00, 0x03, 0x03, 0x00, 0x03, 0x00, 0x00, 0x03,
        0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03,
        0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03,
    ];

    this.itemCount = 0;
    for (var i = 0; i < w * h; i++)
        if ((this.mapData[i] & 0x10) === 0x10)
            this.itemCount++;

    var length;
    length = this.width + 1;
    this.horzBounds.length = 0;
    for (var i = 0; i < length; i++)
        this.horzBounds.push(i / (length - 1) * 2.0 - 1.0);
    length = this.width;
    this.horzPoints.length = 0;
    for (var i = 0; i < length; i++)
        this.horzPoints.push((this.horzBounds[i] + this.horzBounds[i + 1]) / 2.0);
    length = this.height + 1;
    this.vertBounds.length = 0;
    for (var i = 0; i < length; i++)
        this.vertBounds.push((length - 1 - i) / (length - 1) * 2.0 - 1.0);
    length = this.height;
    this.vertPoints.length = 0;
    for (var i = 0; i < length; i++)
        this.vertPoints.push((this.vertBounds[i] + this.vertBounds[i + 1]) / 2.0);

    this.startDivo.x = 4;
    this.startDivo.y = 4;
    this.startPacman.x = 9;
    this.startPacman.y = 1;
    return true;
};

/**
 * Gets start position for Divo.
 */
Map.prototype.getDivoStartPosition = function (p, pf) {
    p.x = this.startDivo.x;
    p.y = this.startDivo.y;
    pf.x = this.horzPoints[p.x];
    pf.y = this.vertPoints[p.y];
};

/**
 * Gets start position for Pacman.
 */
Map.prototype.getPacmanStartPosition = function (p, pf) {
    p.x = this.startPacman.x;
    p.y = this.startPacman.y;
    pf.x = this.horzPoints[p.x];
    pf.y = this.vertPoints[p.y];
};

/**
 * Checks if direction is can be pass.
 */
Map.prototype.canMove = function (movable, direction, p, pf) {
    if (direction === Movable.MOVE_LEFT) {
        var current = movable.point.x;
        var next = current - 1;
        if (next >= 0) {
            var data = this.mapData[movable.point.y * this.width + next];
            var block = (data & 0x01) !== 0;
            if (!block) {
                p.x = next;
                p.y = movable.point.y;
                pf.x = this.horzPoints[p.x];
                pf.y = this.vertPoints[p.y];
                return true;
            }
        }
    }
    else if (direction === Movable.MOVE_RIGHT) {
        var current = movable.point.x;
        var next = current + 1;
        if (next < this.width) {
            var data = this.mapData[movable.point.y * this.width + next];
            var block = (data & 0x01) !== 0;
            if (!block) {
                p.x = next;
                p.y = movable.point.y;
                pf.x = this.horzPoints[p.x];
                pf.y = this.vertPoints[p.y];
                return true;
            }
        }
    }
    else if (direction === Movable.MOVE_UP) {
        var current = movable.point.y;
        var next = current - 1;
        if (next >= 0) {
            var data = this.mapData[next * this.width + movable.point.x];
            var block = (data & 0x01) !== 0;
            if (!block) {
                p.x = movable.point.x;
                p.y = next;
                pf.x = this.horzPoints[p.x];
                pf.y = this.vertPoints[p.y];
                return true;
            }
        }
    }
    else if (direction === Movable.MOVE_DOWN) {
        var current = movable.point.y;
        var next = current + 1;
        if (next < this.height) {
            var data = this.mapData[next * this.width + movable.point.x];
            var block = (data & 0x01) !== 0;
            if (!block) {
                p.x = movable.point.x;
                p.y = next;
                pf.x = this.horzPoints[p.x];
                pf.y = this.vertPoints[p.y];
                return true;
            }
        }
    }

    return false;
};

/**
 * Checks 4-directions which ways can move or not.
 *
 * @return Bit flags in order: left, right, up, down.
 */
Map.prototype.canPreviewMove = function (movable) {
    var x = movable.point.x;
    var y = movable.point.y;
    var result = 0;
    var data;

    // left
    data = this.mapData[y * this.width + x - 1];
    if (x > 0 && (data & 0x01) === 0)
        result |= Movable.MOVE_LEFT;
    // right
    data = this.mapData[y * this.width + x + 1];
    if (x < this.width - 1 && (data & 0x01) === 0)
        result |= Movable.MOVE_RIGHT;
    // up
    data = this.mapData[(y - 1) * this.width + x];
    if (y > 0 && (data & 0x01) === 0)
        result |= Movable.MOVE_UP;
    // down
    data = this.mapData[(y + 1) * this.width + x];
    if (y < this.height - 1 && (data & 0x01) === 0)
        result |= Movable.MOVE_DOWN;

    return result;
};

/**
 * Checks whether that the floor has item.
 */
Map.prototype.checkAndGetItem = function (movable, item) {
    var index = movable.point.y * this.width + movable.point.x;
    if (this.mapData[index] & 0x10) {
        this.imageData[index] = 0;
        this.mapData[index] &= ~0x10;
        this.itemCount--;
        if (this.itemCount <= 0) {
            console.log("Game Over because Divoes eat all items");
            Game.instance().changeScene(Game.SCENE_GAMEOVER);
        }
        return true;
    }
    return false;
};

/**
 * Draws map.
 */
Map.prototype.draw = function (sprite, viewProjectMatrix, scaleMatrix) {
    var translateMatrix = mat4.create();
    var modelMatrix = mat4.create();
    var mvpMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(0, 0, 0));
    mat4.multiply(modelMatrix, translateMatrix, scaleMatrix);
    mat4.multiply(mvpMatrix, viewProjectMatrix, modelMatrix);
    sprite.drawBatch(mvpMatrix, this.horzBounds, this.vertBounds, 0.0, this.imageData);
};

