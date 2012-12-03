goog.provide('su.MatrixMap');

goog.require('lime.Sprite');

goog.require('su.Star');

/**
 *
 * @constructor
 */
su.MatrixMap = function()
{
    goog.base(this);

    this.createGrid();
}

goog.inherits(su.MatrixMap, lime.Sprite);


/**
 * Создает звезды
 */
su.MatrixMap.prototype.createGrid = function()
{
    this._matrix = new lime.Sprite();
    this._stars = [];

    for (var i = 0; i < 100; i++)
    {
        var star = new su.Star();
        star.setPosition(Math.random() * 600, Math.random() * 600);
        this._matrix.appendChild(star);
        this._stars.push(star);
    }
    this._planet1 = new lime.Sprite().setFill('assets/PlanetView.png');
    this._planet1.setPosition(Math.random() * 600, Math.random() * 300);
    this._planet2 = new lime.Sprite().setFill('assets/SaturnView.png');
    this._planet2.setPosition(Math.random() * 600, Math.random() * 300 + 300);
    this._matrix.appendChild(this._planet1);
    this._matrix.appendChild(this._planet2);

    this.appendChild(this._matrix);
};
