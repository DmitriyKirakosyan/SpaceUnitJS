goog.provide('su.GameScene');

goog.require('su.GameModeID');
goog.require('su.MatrixMap');
goog.require('su.Ship');
goog.require('su.Bullet');
goog.require('su.ScorePanel');

goog.require('lime.Sprite');
goog.require('lime.RoundedRect');
goog.require('lime.scheduleManager');

goog.require('goog.math.Coordinate');

/**
 * Создает сцену игры
 * @param container
 * @constructor
 */
su.GameScene = function(container) {
    goog.base(this);

    this._gameBkg; //Sprite
    this._matrixMap; //MatrixMap;
    this._ship; //:Ship;
    this._scorePanel = new su.ScorePanel(); //Points;
    //this._resultWindow; //:ResultWindow;

    this._bullets = [];
    this._enemies = [];
    //this._blows = []; //V.<BlowView>;

    this.shipToLeft = false;
    this.shipToRight = false;
    this.shipToUp = false;
    this.shipToDown = false;

    this._mousePoint = new goog.math.Coordinate();

    this.gameMode = su.GameModeID.RUN_GAME;

    this.SHOT_SPEED = 5;
    this._shotIterator = 0;

    this._onShot = false;

    this._timerPointsStart = 0;
    this._timerPointsEnd = 0;

    this._container = container;
};

// define parent class
goog.inherits(su.GameScene,lime.Node);

/**
 * Открывает сцену игры
 */
su.GameScene.prototype.open = function() {
    this._gameBkg = new lime.RoundedRect().setSize(1200, 1200).setFill(100,100,100);
    this._container.appendChild(this._gameBkg);
    this._matrixMap = new su.MatrixMap();
    this._container.appendChild(this._matrixMap);
    this.createShip();
    this.createScorePanel();
    this._bullets = [];
    this._enemies = [];
    //_blows = new Vector.<BlowView>();
    this._timeAddEnemy = Math.random()*2;

    lime.scheduleManager.scheduleWithDelay(this.onEnemyAddTimer, this, this._timeAddEnemy);

    lime.scheduleManager.scheduleWithDelay(this.onClockTimer, this, 100);

    this.addActionListeners();

    goog.events.listen(this._gameBkg, goog.events.EventType.MOUSEMOVE, this.onMouseMove, false, this);
    lime.scheduleManager.schedule(this.updateMoving, this);

    this._timerPointsStart = new Date().getTime();
};


su.GameScene.prototype.onClockTimer = function()
{
    this._scorePanel.tick();
}


su.GameScene.prototype.onMouseMove = function(event)
{
    this._mousePoint.x = event.position.x;
    this._mousePoint.y = event.position.y;
}

su.GameScene.prototype.remove = function() {
    this._container.removeChild(this._gameBkg);
    this._container.removeChild(this._matrixMap);
    this._container.removeChild(this._ship);
    this._container.removeChild(this._scorePanel);
    lime.scheduleManager.unschedule(this.onEnemyAddTimer, this);
    lime.scheduleManager.unschedule(this.onClockTimer, this);
    //_container.removeChild(_resultWindow);
    this.removeArrays();
}

/**
 * Добавляет слушателей клавиатуры
 */
su.GameScene.prototype.addActionListeners = function()
{
    goog.events.listen(document, goog.events.EventType.KEYDOWN, this.onKeyDown, false, this);
    goog.events.listen(document, goog.events.EventType.KEYUP, this.onKeyUp, false, this);

    goog.events.listen(document, goog.events.EventType.MOUSEDOWN, this.startShot, false, this);
    goog.events.listen(document, goog.events.EventType.MOUSEUP, this.stopShot, false, this);

};

su.GameScene.prototype.removeActionListeners = function() {
    lime.scheduleManager.unschedule(this.updateMoving, this);
    goog.events.unlisten(document, goog.events.EventType.KEYDOWN, this.onKeyDown, false, this);
    goog.events.unlisten(document, goog.events.EventType.KEYUP, this.onKeyUp, false, this);
    goog.events.unlisten(document, goog.events.EventType.MOUSEDOWN, this.startShot, false, this);
    goog.events.unlisten(document, goog.events.EventType.MOUSEUP, this.stopShot, false, this);

    this.stopShot(null);
};

su.GameScene.prototype.removeArrays = function()
{
    var i = 0;
    for (i = 0; i < this._bullets.length; ++i) {
        if (this._container.getChildIndex(this._bullets[i]) != -1) { this._container.removeChild(this._bullets[i]); }
    }
    for (i = 0; i < this._enemies.length; ++i) {
        if (this._container.getChildIndex(this._enemies[i])) { this._container.removeChild(this._enemies[i]); }
    }
//    for (i = 0; i < this._blows) {
//        if (_container.contains(blow)) { _container.removeChild(blow); }
//    }
    this._bullets = null;
    this._enemies = null;
    //this._blows = null;
};

/* SHIP */
/**
 * Создает корабль игрока
 */
su.GameScene.prototype.createShip = function() {
    this._ship = new su.Ship(this._matrixMap);
    this.shipToLeft = false;
    this.shipToRight = false;
    this.shipToUp = false;
    this.shipToDown = false;
    this._container.appendChild(this._ship);
    this._ship.setPosition(300, 300);
}

su.GameScene.prototype.onKeyDown = function(event) {
    this._ship.shipMove(event);
};

su.GameScene.prototype.updateMoving = function()
{
    if (this._onShot) {
        if (this._shotIterator == this.SHOT_SPEED) {
            this.startShot(null);
            this._shotIterator = 0;
        } else { this._shotIterator++; }
    }
    this._ship.updateShipMove();
    this._ship.gunRotate(this._mousePoint);
    this.bulletMove();
    this.enemyMove();
    this.hitTestShip();
}

su.GameScene.prototype.onKeyUp = function(event) {
    this._ship.shipStopMove(event);
}

/* Bullet */
su.GameScene.prototype.startShot = function(event)
{
    this._onShot = true;
    var bullet = new su.Bullet(this._ship.getRotation());
    bullet.x = this._ship.getX() + Math.cos(this._ship.getRotation()/180 * Math.PI)*this._ship.gunWidth;
    bullet.y = this._ship.getY() + Math.sin(this._ship.getRotation()/180 * Math.PI)*this._ship.gunWidth;
    var speedX = 0;
    var speedY = 0;
    if (this.shipToRight) { speedX += 3; }
    if (this.shipToLeft) { speedX -= 3; }
    if (this.shipToUp) { speedY -= 3; }
    if (this.shipToDown) { speedY += 3; }

    bullet.speedBulletX = 10*Math.cos(this._ship.getRotation()/180 * Math.PI) + speedX;
    bullet.speedBulletY = - 10*Math.sin(this._ship.getRotation()/180 * Math.PI) + speedY;
    bullet.setPosition(this._ship.getPosition());
    this._container.appendChild(bullet);
    this._bullets.push(bullet);
};

su.GameScene.prototype.stopShot = function(event)
{
    this._onShot = false;
    this._shotIterator = 0;
};

su.GameScene.prototype.bulletMove = function() {
    for (var i = 0; i < this._bullets.length; i++) {
        this._bullets[i].move();
        var wasHit = this.hitTestBullet(this._bullets[i]);
        if (wasHit) { return; }
        if (this._bullets[i].getX() < 0 || this._bullets[i].getX() > 600 || this._bullets[i].getY() < 0 || this._bullets[i].getY() > 600) {
            if (this._container.getChildIndex(this._bullets[i]) != -1) { this._container.removeChild(this._bullets[i]); }
            this._bullets.splice(i, 1);
            break;
        }
    }
}
/* Enemy */

/**
 * Добавляет врага на сцену
 */
su.GameScene.prototype.onEnemyAddTimer = function() {
    if (this.gameMode == su.GameModeID.RUN_GAME) { this._timeAddEnemy = Math.random()*1200; }
    else { this._timeAddEnemy = Math.random()*500; }

    lime.scheduleManager.unschedule(this.onEnemyAddTimer, this);
    lime.scheduleManager.scheduleWithDelay(this.onEnemyAddTimer, this, this._timeAddEnemy);

    var enemy = new su.Enemy();
    enemy.randomPosition(10,10);
    this._container.appendChild(enemy);
    this._enemies.push(enemy);
};

/**
 * Двигает врага
 */
su.GameScene.prototype.enemyMove = function() {
    for (var j = 0; j < this._enemies.length; j++) {
        if (this.gameMode == su.GameModeID.RUN_GAME) { this._enemies[j].move(this._ship.getX(), this._ship.getY()); }
        else { this._enemies[j].simpleMove(); console.log("simple move for enemy"); }

        if (this._enemies[j].isOutOfScreen())
        {
            const index = this._enemies.indexOf(this._enemies[j]);
            if (index >= 0) { this._enemies.splice(index, 1); }
            if (this._container.getChildIndex(this._enemies[j]) != -1) { this._container.removeChild(this._enemies[j]); }
        }
    }
};

/* Hit Tests */
su.GameScene.prototype.hitTestShip = function()
{
    var me = this;
    this._enemies.map(function(enemy)
    {
        if (me.hitTestObjects(enemy, me._ship)) {
            me.gameOver();
            return;
        }
        else
        {
//            console.log(enemy.getSize(), me._ship.getSize());
//            console.log(enemy.getBoundingBox(), me._ship.getBoundingBox());
        }
    });
}

su.GameScene.prototype.hitTestObjects = function(object1, object2)
{
    return goog.math.Box.intersects(object1.getBoundingBox(), object2.getBoundingBox());
}

/**
 * Проверяет на столкновение пули с целью
 * @param bullet
 * @return {Boolean} true если пуля столкнулась с целью
 */
su.GameScene.prototype.hitTestBullet = function(bullet)
{
    var goal = false;
    for (var i = 0; i < this._enemies.length; ++i)
    {
        console.log(bullet.getSize());
        console.log(bullet.getBoundingBox());
        if (this.hitTestObjects(this._enemies[i], bullet)) {
            if (this._scorePanel.clockSeconds <= 0) { this._scorePanel.clockSeconds = 0; } else { this._scorePanel.clockSeconds -= 1; }
            if (this._scorePanel.clockMinutes > 0) { this._scorePanel.clockMinutes -= 1; }
            this._scorePanel.addPoint(1);
            const index = this._enemies.indexOf(this._enemies[i]);
            if (this._container.getChildIndex(this._enemies[i])) { this._container.removeChild(this._enemies[i]); }
            if (index >= 0) { this._enemies.splice(index, 1); }
            goal = true;
            break;
        }
    }

    if (goal)
    {
        this._container.removeChild(bullet);
        this._bullets.splice(this._bullets.indexOf(bullet), 1);
        return true;
    }
    return false;
};

su.GameScene.prototype.createScorePanel = function()
{
    this._scorePanel = new su.ScorePanel();
    this._scorePanel.barMode(this.gameMode);
    this._container.appendChild(this._scorePanel);
    this._scorePanel.setScale(2);
    this._scorePanel.setPosition(20, 10);
};

/* Game Over and Restart Game */
su.GameScene.prototype.gameOver = function() {
    this.removeActionListeners();
    lime.scheduleManager.unschedule(this.onEnemyAddTimer, this);
    //timeClock.stop();
    //trace(_points.time);
    //TODO не выдает текстовое значение
    this._timerPointsEnd = new Date().getTime();
    var timerPoints = this._timerPointsEnd - this._timerPointsStart - this._scorePanel.points * 1000;
    if (timerPoints < 0) { timerPoints = 0; }
    //trace("TIMER POINTS " + timerPoints);
    //trace("START TIME " + _timerPointsStart);
    //trace("END TIME " + _timerPointsEnd);
    //trace(_points.points);
    //_container.stage.focus = MochiScores
//    if (this._gameMode == su.GameModeID.RUN_GAME) {
//        MochiScores.showLeaderboard({
//        boardID: boardID_Time,
//        score: timerPoints,
//        onClose: showEndWindow
//        });
//    }
//    else if (_gameMode == GameModeID.SHOOT_GAME) {
//        MochiScores.showLeaderboard({
//        boardID: boardID_Point,
//        score: _points.points,
//        onClose: showEndWindow
//        });
//    }
    this.showEndWindow();
}
su.GameScene.prototype.showEndWindow = function()
{
    //_timerEnemy.reset();
   // timeClock.reset();
//    this._resultWindow = new limeResultWindow;
//    _resultWindow.x = 230;
//    _resultWindow.y = 250;
//    if (_gameMode == GameModeID.RUN_GAME) { _resultWindow.resultTxt = "   TIME:\n" + _points.timeResult; }
//    else if (_gameMode == GameModeID.SHOOT_GAME) { _resultWindow.resultTxt = _points.pointsResult; }
//    _container.addChild(_resultWindow);
    goog.events.listen(document, goog.events.EventType.MOUSEDOWN, this.newGame, false, this);
}

su.GameScene.prototype.newGame = function(event)
{
    goog.events.unlisten(document, goog.events.EventType.MOUSEDOWN, this.newGame, false, this);
    goog.events.dispatchEvent(this, new goog.events.Event(su.SceneController.SWITCH_SCENE_EVENT));
}
