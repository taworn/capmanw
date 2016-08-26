/* global mat4, vec3, Game, Sprite, Animation, Map, Movable, Divo, Pacman */

/**
 * A GameData class.
 */
function GameData() {
    GameData.singleton = this;
    this.divoList = [];
}

/**
 * Clears data.
 */
GameData.prototype.clear = function () {
    this.divoList = [];
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

GameData.instance = function () {
    return GameData.singleton;
};

