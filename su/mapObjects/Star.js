goog.provide('su.Star');

goog.require('lime.Sprite');

su.Star = function()
{
    goog.base(this);
    var arrStars = ['assets/Star_1.png', 'assets/Star_2.png', 'assets/Star_3.png'];
    var rnd = Math.random() * .5;
    var id = Math.round(Math.random() * (arrStars.length - 1));

    var star = new lime.Sprite().setFill(arrStars[id]);
    star.setRotation(Math.random() * 360);
    star.setScale(rnd);
    this.appendChild(star);
}

goog.inherits(su.Star, lime.Sprite);
