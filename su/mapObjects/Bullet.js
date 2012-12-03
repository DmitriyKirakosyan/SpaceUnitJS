goog.provide('su.Bullet');

goog.require('lime.Sprite');

su.Bullet = function(angle)
{
    goog.base(this);
    this.speedBulletX = 0;
    this.speedBulletY = 0;
    this.setFill('assets/Star_3.png');//'assets/SimpleBulletView.png');
    this.setRotation(90 + angle);
};

goog.inherits(su.Bullet, lime.Sprite);

su.Bullet.prototype.move = function()
{
    this.setPosition(this.getX() + this.speedBulletX, this.getY() + this.speedBulletY);
};