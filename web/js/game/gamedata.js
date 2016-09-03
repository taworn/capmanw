/* global mat4, vec3, Game, Sprite, Animation, Map, Movable, Divo, Pacman */

/**
 * A GameData class.
 */
function GameData() {
    GameData.singleton = this;
    this.score = parseInt(localStorage.getItem("score"));
    this.stage = parseInt(localStorage.getItem("stage"));
    if (this.score !== this.score)
        this.score = 0;
    if (this.stage !== this.stage)
        this.stage = 0;
    this.reverseMode = false;
    this.reverseTime = 0;
    this.divoLife = 0;
    this.divoList = [];
}

/**
 * Resets all game data.
 */
GameData.prototype.reset = function () {
    this.score = 0;
    this.stage = 0;
    this.clear();
};

/**
 * Clears data.
 */
GameData.prototype.clear = function () {
    this.reverseMode = false;
    this.divoLife = 5 * (this.stage + 1);
    this.divoList = [];
};

/**
 * Saves data.
 */
GameData.prototype.save = function () {
    localStorage.setItem("score", this.score);
    localStorage.setItem("stage", this.stage);
};

/**
 * Advances to next stage.
 * @return Returns true if next stage, otherwise, it is false and win the game.
 */
GameData.prototype.nextStage = function () {
    if (this.stage < 2) {
        this.stage++;
        return true;
    }
    else
        return false;
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
        this.reverseMode = true;
        this.reverseTime = 2500;
    }
};

GameData.instance = function () {
    return GameData.singleton;
};

/**
 * Checks current time is reverse mode.
 */
GameData.prototype.isReverseMode = function () {
    return this.reverseMode;
};

/**
 * Updates current time frame.
 */
GameData.prototype.update = function (timeUsed) {
    if (this.reverseMode) {
        this.reverseTime -= timeUsed;
        if (this.reverseTime <= 0)
            this.reverseMode = false;
        console.log("reverseMode: " + this.reverseMode);
    }
};

