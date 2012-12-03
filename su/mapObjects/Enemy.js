goog.provide('su.Enemy');

goog.require('lime.Sprite');

/**
 * Враг, он же астероид
 * @constructor
 */
su.Enemy = function()
{
    goog.base(this);

    su.Enemy.EnemyView1 = "assets/EnemyView.png";
    su.Enemy.EnemyView2 = "assets/EnemyView_2.png";

    this._speedX = 0;//:Number;
    this._speedY = 0;//Number;
    this._random = Math.random();
    this._rotSpeed = 0; //Number
    this._model = 0;//:int;
    this._arrModel = [1, 1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1];

    var id = Math.round(Math.random() * (this._arrModel.length - 1));

    this._model = this._arrModel[id];

    if (this._model == 1) { this.setFill(su.Enemy.EnemyView2); }
    else if (this._model == 2) { this.setFill(su.Enemy.EnemyView1); }
    else { console.log("MODEL>>>>> ",this._model, id); }

    this._enemySpeed = 2 + Math.random();
};

// define parent class
goog.inherits(su.Enemy, lime.Sprite);

su.Enemy.prototype.randomPosition = function(speedX, speedY) {
    this._random = Math.random();
    this._rotSpeed = Math.random() * 10 - 5;
    if (this._random < .25) {
        this.setPosition(Math.random()*600, -20);
        this._speedX = 0;
        this._speedY = Math.random() * speedY;
    }
    if (this._random > .25 && this._random < .5) {
        this.setPosition(Math.random()*600, 620);
        this._speedX = 0;
        this._speedY = -Math.random() * speedY;
    }
    if (this._random > .5 && this._random < .75) {
        this.setPosition(-20, Math.random() * 600);
        this._speedX = Math.random() * speedX;
        this._speedY = 0;
    }
    if (this._random > .75) {
        this.setPosition(620, Math.random() * 600);
        this._speedX = -Math.random() * speedX;
        this._speedY = 0;
    }
}

su.Enemy.prototype.move = function(targetX, targetY) {
    this.setRotation(this.getRotation() + this._rotSpeed);
    var dx = targetX - this.getX();
    var dy = targetY - this.getY();
    var d = Math.sqrt(dx*dx+dy*dy);
    var vx;
    var vy;
    if (d==0){
        vx = 0;
        vy = 0;
    } else {
        vx = dx/d * this._enemySpeed;
        vy = dy/d * this._enemySpeed;
    }
    this.setPosition(this.getX() + vx, this.getY() + vy);
}

su.Enemy.prototype.simpleMove = function()
{
    this.setRotation(this.getRotation() + this._rotSpeed);
    this.setPosition(this.getX() + this._speedX, this.getY() + this._speedY);
}

su.Enemy.prototype.isOutOfScreen = function()
{
    return (this.getX() > 630 || this.getX() < -30 ||
        this.getY() > 630 || this.getY() < -30);
};