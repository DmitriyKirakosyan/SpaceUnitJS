goog.provide('su.Ship');

goog.require('lime.Sprite');
goog.require('goog.events.KeyCodes');
goog.require('goog.math.Coordinate');


su.Ship  = function(matrix)
{
    goog.base(this);
    this.gunWidth = 20;
    this.sheepSpeed = 5;
    this._onMove = false;
    this._matrixMap = matrix;
    this.setFill('assets/ShipView.png');
}

//inherits
goog.inherits(su.Ship, lime.Sprite);

su.Ship.prototype.createShip = function()
{
    //_ship = new Sprite;
    //addEventListener(Event.ADDED_TO_STAGE, glowShip);
    //TweenMax.to(this, .0001, {blurFilter:{blurX:10, blurY:10}});
}
//		private function glowShip(event:Event):void {
//			TweenMax.to(this, 2, {blurFilter:{blurX:0, blurY:0}});
//		}
		
su.Ship.prototype.shipMove = function(event/*KeyboardEvent*/) {
    this._onMove = true;
    if (event.keyCode == goog.events.KeyCodes.RIGHT || event.keyCode == goog.events.KeyCodes.D) { this.shipToRight = true; }
    if (event.keyCode == goog.events.KeyCodes.LEFT || event.keyCode == goog.events.KeyCodes.A) { this.shipToLeft = true; }
    if (event.keyCode == goog.events.KeyCodes.DOWN || event.keyCode == goog.events.KeyCodes.S) { this.shipToDown = true; }
    if (event.keyCode == goog.events.KeyCodes.UP || event.keyCode == goog.events.KeyCodes.W) { this.shipToUp = true; }
    this.showMove();
}
		//TODO доделать эффект скролла карты
su.Ship.prototype.updateShipMove = function()
{
    //if (this._gun.currentFrame >= 10) { _gun.gotoAndPlay(2); }
    //if (!this.shipToRight && !this.shipToLeft && !this.shipToDown && !this.shipToUp ) { this._gun.gotoAndStop(1); }
    if (this.shipToRight) { this.setX(this.getX() + this.sheepSpeed); }
    if (this.shipToLeft)  { this.setX(this.getX() - this.sheepSpeed); }
    if (this.shipToDown)  { this.setY(this.getY() + this.sheepSpeed); }
    if (this.shipToUp)    { this.setY(this.getY() - this.sheepSpeed); }

    if (this.getX() < 10)  { this.setX(10); }
    if (this.getX() > 590) { this.setX(590); }
    if (this.getY() < 10)  { this.setY(10); }
    if (this.getY() > 590) { this.setY(590); }
};

/**
 * Остановить движение
 * @param event
 */
su.Ship.prototype.shipStopMove = function(event)
{
    this._onMove = false;
    if (event.keyCode == goog.events.KeyCodes.RIGHT || event.keyCode == goog.events.KeyCodes.D) { this.shipToRight = false; }
    if (event.keyCode == goog.events.KeyCodes.LEFT || event.keyCode == goog.events.KeyCodes.A) { this.shipToLeft = false; }
    if (event.keyCode == goog.events.KeyCodes.DOWN || event.keyCode == goog.events.KeyCodes.S) { this.shipToDown = false; }
    if (event.keyCode == goog.events.KeyCodes.UP || event.keyCode == goog.events.KeyCodes.W) { this.shipToUp = false; }
};

/**
 *
 * @param {goog.math.Coordinate} mousePoint
 */
su.Ship.prototype.gunRotate = function(mousePoint)
{
    var dx = this.getX() - mousePoint.x;
    var dy = -(this.getY() - mousePoint.y);
    var angle = Math.atan2(dy, dx)*180/Math.PI;
    this.setRotation(180 + angle);
};

su.Ship.prototype.showMove = function()
{
    //if (_onMove) { _gun.gotoAndPlay(2); }
};
