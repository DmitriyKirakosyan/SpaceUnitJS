goog.provide('su.ScorePanel');

goog.require('lime.Sprite');
goog.require('lime.Label');

su.ScorePanel = function() {
    goog.base(this);
    this._points = 0;
    this.clockHours = 0;
    this.clockMinutes = 0;
    this.clockSeconds = 0;
    this.clockMiliSeconds = 0;

    this._clockText = new lime.Label().setFontColor(0x00FF00).setX(30).setText("00 : 00 : 00 : 00");
    this.appendChild(this._clockText);
    this._pointText = new lime.Label().setX(220).setFontColor(0x00ff00).setText("Points: " + this._points);
    this.appendChild(this._pointText);
}

goog.inherits(su.ScorePanel, lime.Sprite);


su.ScorePanel.prototype.getTimeResult = function() { return this._clockText.getText(); };
su.ScorePanel.prototype.getPointsResult = function() { return this._pointText.getText(); };

su.ScorePanel.prototype.barMode = function(mode)
{
    //if (mode == 0) { this._pointText.setAlpha(0); this._clockText.setAlpha(1); }
    //else if (mode == 1) { this._pointText.setalpha = 1; this._clockText.alpha = 0; }
};

su.ScorePanel.prototype.addPoint = function(points) {
    this._points += points;
    this._pointText.setText("Points: " + this._points);
}

su.ScorePanel.prototype.tick = function() {
    this.clockMiliSeconds +=1;
    if (this.clockMiliSeconds == 10) {
        this.clockSeconds += 1;
        this.clockMiliSeconds = 0;
    }
    if (this.clockSeconds == 60) {
        this.clockMinutes += 1;
        this.clockSeconds = 0;
    }
    if (this.clockMinutes == 60) {
        this.clockHours += 1;
        this.clockMinutes = 0;
    }
    this._clockText.setText(this.clockHours + " : " + this.clockMinutes +
                                    " : " + this.clockSeconds + " : " + this.clockMiliSeconds);
}
