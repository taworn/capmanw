/* global mat4, vec3, Game, NormalShader, Scene, SCENE_TITLE */

/**
 * Playing game scene.
 */
function PlayScene() {
    console.log("PlayScene created");
}

PlayScene.prototype = new Scene();

PlayScene.prototype.init = function () {
    Scene.prototype.init();
    console.log("init() called");

    this.modelX = 0.0;
    this.modelY = 0.0;
    this.modelDx = 0.0;
    this.modelDy = 0.0;
    this.angle = 0.0;
    this.angleToPlus = 5.0;

    // generates buffer
    var gl = this.getGL();
    var verticesData = [
        // X, Y, Z, R, G, B, A
        -1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
        1.0, -1.0, 0.0, 0.0, 0.0, 1.0, 1.0
    ];
    this.verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesData), gl.STATIC_DRAW);
};

PlayScene.prototype.finish = function () {
    console.log("finish() called");
    this.getGL().deleteBuffer(this.verticesId);
    Scene.prototype.finish();
};

PlayScene.prototype.handleKey = function (e) {
    if (e.keyCode === 32) {
        console.log("key SPACE");
    }
    else if (e.keyCode === 87 || e.keyCode === 38) {
        console.log("key W or UP");
        this.modelDy = -0.1;
    }
    else if (e.keyCode === 83 || e.keyCode === 40) {
        console.log("key S or DOWN");
        this.modelDy = 0.1;
    }
    else if (e.keyCode === 65 || e.keyCode === 37) {
        console.log("key A or LEFT");
        this.modelDx = -0.1;
    }
    else if (e.keyCode === 68 || e.keyCode === 39) {
        console.log("key D or RIGHT");
        this.modelDx = 0.1;
    }
    else if (e.keyCode === 13) {
        console.log("key ENTER");
        Game.instance().changeScene(SCENE_TITLE);
    }
};

PlayScene.prototype.render = function () {
    var gl = this.getGL();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var normalShader = this.getNormalShader();
    normalShader.useProgram(gl);

    // model matrix
    var translateMatrix = mat4.create();
    mat4.translate(translateMatrix, translateMatrix, vec3.fromValues(this.modelX + this.modelDx, this.modelY + this.modelDy, 0));
    this.modelX += this.modelDx;
    this.modelY += this.modelDy;
    this.modelDx = 0.0;
    this.modelDy = 0.0;
    var rotateMatrix = mat4.create();
    mat4.rotate(rotateMatrix, rotateMatrix, this.angle * (Math.PI / 180), vec3.fromValues(0, 1, 0));
    this.angle += this.angleToPlus;
    if (this.angle > 89.0 || this.angle < -89.0)
        this.angleToPlus = -this.angleToPlus;
    //console.log("translateMatrix: " + mat4.str(translateMatrix));
    //console.log("rotateMatrix: " + mat4.str(rotateMatrix));

    // view matrix
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix
            , vec3.fromValues(0, 0, 1.5)
            , vec3.fromValues(0, 0, -5)
            , vec3.fromValues(0, 1, 0));
    //console.log("viewMatrix: " + mat4.str(viewMatrix));

    // projection matrix
    var projectionMatrix = mat4.create();
    mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, -1.0, 25.0);
    //console.log("projectionMatrix: " + mat4.str(projectionMatrix));

    // combines model, view, projection matrices
    var mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, rotateMatrix);
    mat4.multiply(mvpMatrix, mvpMatrix, translateMatrix);
    //console.log("mvpMatrix: " + mat4.str(mvpMatrix));
    //console.log("");

    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesId);
    gl.vertexAttribPointer(normalShader.getPosition(), 3, gl.FLOAT, false, 7 * 4, 0 * 4);
    gl.enableVertexAttribArray(normalShader.getPosition());
    gl.vertexAttribPointer(normalShader.getColor(), 4, gl.FLOAT, false, 7 * 4, 3 * 4);
    gl.enableVertexAttribArray(normalShader.getColor());
    gl.uniformMatrix4fv(normalShader.getMVPMatrix(), false, mvpMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(0);

    this.computeFPS();
};

