/* global mat4, vec3, Game, Sprite, Animation, Map, Movable, Divo, Pacman */

/**
 * A GameData class.
 */
function GameData() {
    GameData.singleton = this;
    this.score = 0;
    this.divoLife = 0;
    this.divoList = [];
}

/**
 * Clears data.
 */
GameData.prototype.clear = function () {
    this.divoLife = 5;
    this.divoList = [];
};

/**
 * Decrease divo life by one.
 */
GameData.prototype.divoLifeDecrease = function () {
    this.divoLife--;
};

/**
 * Checks divo can respawn.
 */
GameData.prototype.divoCanRelife = function () {
    return this.divoLife > 0;
};

/**
 * Adds divo to list.
 */
GameData.prototype.addDivo = function (divo) {
    this.divoList.push(divo);
};

/**
 * Gets divo in list.
 */
GameData.prototype.getDivo = function (id) {
    return this.divoList[id];
};

/**
 * Gets number of divoes in list.
 */
GameData.prototype.getDivoCount = function () {
    return this.divoList.length;
};

/**
 * Checks that all divoes dead.
 */
GameData.prototype.checkAllDivoDead = function () {
    var i = 0;
    while (i < this.divoList.length) {
        if (!this.divoList[i].isDead())
            return false;
        else
            i++;
    }
    return true;
};

/**
 * Retrieves bonus after get item.
 */
GameData.prototype.getBonus = function (item) {
    if (item === 0x01) {
        this.score += 10;
    }
    else if (item === 0x02) {
        this.score += 100;
    }
};

GameData.instance = function () {
    return GameData.singleton;
};

