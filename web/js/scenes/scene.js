
function Scene() {
    this.timeStart = performance.now();
    this.frameCount = 0;
}

Scene.prototype.fps = function (timeCurrent) {
    this.frameCount++;
    var timeUsage = timeCurrent - this.timeStart;
    if (timeUsage > 1000) {
        var fps = this.frameCount * 1000 / timeUsage;
        this.timeStart = timeCurrent;
        this.frameCount = 0;
        console.log("FPS: " + fps);
    }
}

Scene.prototype.finish = function () {
    console.log("finish() called");
};

Scene.prototype.handleKey = function (e) {
    console.log("key " + e.keyCode);
};

Scene.prototype.render = function (timeCurrent) {
};

