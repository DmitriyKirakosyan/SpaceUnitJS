goog.provide('su.MenuScene');

goog.require('lime.Circle');
goog.require('lime.Sprite');
goog.require('su.Enemy');

goog.require('goog.events');

/**
 * Создает сцену меню
 * @param container
 * @constructor
 */
su.MenuScene = function(container) {
    goog.base(this);
    su.MenuScene.BTN_RUN_IMG1 = 'assets/PlayBtnRun_1.png';
    su.MenuScene.BTN_RUN_IMG2 = 'assets/PlayBtnRun_2.png';
    su.MenuScene.BTN_SHOOT_IMG1 = 'assets/PlayBtnShoot_1.png';
    su.MenuScene.BTN_SHOOT_IMG2 = 'assets/PlayBtnShoot_2.png';
    su.MenuScene.StarView2 = 'assets/Star_1.png';

    this.gameMode = su.GameModeID.RUN_GAME;
    this._asters = [];
    this.stars = [];

    this._container = container;
    this.createBackground();
    this.createPlayBtnRun();
    this.createPlayBtnShoot();
};

// define parent class
goog.inherits(su.MenuScene,lime.Node);

/**
 * Открывает сцену меню
 */
su.MenuScene.prototype.open = function() {
    //this.createBackground();
    this.createAsteroids();
    this.createStars();
    this._container.appendChild(this._background);
    this._container.appendChild(this._playBtnRun);
    this._container.appendChild(this._playBtnShoot);

    lime.scheduleManager.schedule(this.moveAsteroids, this);
};

/**
 * Диструктор
 */
su.MenuScene.prototype.remove = function() {
    this._container.removeChild(this._playBtnRun);
    this._container.removeChild(this._playBtnShoot);

    this.removeStars();
    this.removeAsteroids();
    lime.scheduleManager.unschedule(this.moveAsteroids, this);
};

/**
 * Создает звезды
 */
su.MenuScene.prototype.createStars = function()
{
    this._stars = [];
    var len = Math.random() * 20 + 60;
    for (var i = 0; i < len; i++) {
        var star = new lime.Sprite().setFill(su.MenuScene.StarView2);
        star.setPosition(Math.random() * 600, Math.random() * 600)
        star.setScale(Math.random() * 1);
        this._background.appendChild(star);
        this._stars.push(star);
    }
};

/**
 * Удаляет звезды
 */
su.MenuScene.prototype.removeStars = function()
{
    var me = this;
    this._stars.map(function(element)
    {
        if (me._background.getChildIndex(element) != -1) { me._background.removeChild(element); }
    })
    this._stars = [];
};

/**
 * Создает астероиды
 */
su.MenuScene.prototype.createAsteroids = function() {
    this._asters = [];
    var len = Math.random() * 4 + 5;
    for (var i = 0; i < len; i++) {
        var aster = new su.Enemy();
        aster.randomPosition(5,5);
       this._background.appendChild(aster);
       this._asters.push(aster);
    }
};

/**
 * Удаляет астероиды
 */
su.MenuScene.prototype.removeAsteroids = function() {
    var me = this;
    this._asters.map(function(element) {
        if (me._background.getChildIndex(element) != -1) { me._background.removeChild(element); }
    });
    this._asters = [];
};

/**
 * ENTER_FRAME
 */
su.MenuScene.prototype.moveAsteroids = function() {
    var me = this;
    this._asters.map(function(element)
    {
        element.simpleMove();
        me.removeCheck(element);
    });
};

/**
 * Если астероид вышел за пределы экрана, возвращаем его на место
 * @param aster
 */
su.MenuScene.prototype.removeCheck = function(aster) {
    if (aster.getPosition().x > 630 || aster.getPosition().x < -30 ||
        aster.getPosition().y > 630 || aster.getPosition().y < -30) {
        aster.randomPosition(5,5);
    }
};


//Scene GUI

/**
 * Создает бекграунд
 */
su.MenuScene.prototype.createBackground = function()
{
    this._background = new lime.Sprite();
};

su.MenuScene.prototype.createPlayBtnRun = function()
{
    this._playBtnRun = new lime.Sprite().setFill(su.MenuScene.BTN_RUN_IMG1).setPosition(150, 450);

    var menu = this;
    console.log(menu);
    goog.events.listen(this._playBtnRun, goog.events.EventType.MOUSEOVER, this.onPlayBtnMouseOver, false, this);
    goog.events.listen(this._playBtnRun, goog.events.EventType.MOUSEOUT, this.onPlayBtnMouseOut, false, this);
    goog.events.listen(this._playBtnRun, goog.events.EventType.CLICK, this.onPlayBtnRunClick, false, this);
};

su.MenuScene.prototype.createPlayBtnShoot = function()
{
    this._playBtnShoot = new lime.Sprite().setFill(su.MenuScene.BTN_SHOOT_IMG1).setPosition(450, 450);

    var menu = this;
    goog.events.listen(this._playBtnShoot, goog.events.EventType.MOUSEOVER, this.onPlayBtnMouseOver, false, this);
    goog.events.listen(this._playBtnShoot, goog.events.EventType.MOUSEOUT, this.onPlayBtnMouseOut, false, this);
    goog.events.listen(this._playBtnShoot, goog.events.EventType.CLICK, this.onPlayBtnShootClick, false, this);
};

su.MenuScene.prototype.onPlayBtnMouseOver = function(event) {
			//TweenMax.to(_menu, .4, { blurFilter: { blurX:10, blurY:10, quality:2 }} );
    (event.target == this._playBtnRun) ?
        event.target.setFill(su.MenuScene.BTN_RUN_IMG2) :
        event.target.setFill(su.MenuScene.BTN_SHOOT_IMG2);

//			TweenMax.to(button, .4, { blurFilter: { blurX:10, blurY:10, quality:2 }} );
};

su.MenuScene.prototype.onPlayBtnMouseOut = function(event) {

    (event.target == this._playBtnRun) ?
        event.target.setFill(su.MenuScene.BTN_RUN_IMG1) :
        event.target.setFill(su.MenuScene.BTN_SHOOT_IMG1);
//			TweenMax.to(_menu, .4, { blurFilter: { blurX:00, blurY:00 }} );
//			TweenMax.to(button, .4, { blurFilter: { blurX:00, blurY:00 }} );
};

su.MenuScene.prototype.onPlayBtnRunClick = function(event) {
//			_playBtnRun.removeEventListener(MouseEvent.MOUSE_OVER, onPlayBtnMouseOver);
//			_playBtnRun.removeEventListener(MouseEvent.MOUSE_OUT, onPlayBtnMouseOut);
//			_playBtnRun.removeEventListener(MouseEvent.CLICK, onPlayBtnRunClick);
    this.gameMode = su.GameModeID.RUN_GAME;
    this.switchScene();
};
		//
su.MenuScene.prototype.onPlayBtnShootClick = function(event) {
//			event.stopPropagation();
//			_playBtnShoot.removeEventListener(MouseEvent.MOUSE_OVER, onPlayBtnMouseOver);
//			_playBtnShoot.removeEventListener(MouseEvent.MOUSE_OUT, onPlayBtnMouseOut);
//			_playBtnShoot.removeEventListener(MouseEvent.CLICK, onPlayBtnShootClick);
    this.gameMode = su.GameModeID.SHOOT_GAME;
    this.switchScene();
};

su.MenuScene.prototype.switchScene = function() {
        //TweenMax.to(_menu, .1, { blurFilter: { blurX:0, blurY:0, quality:2 }} );
    console.log("try dispatch");
    goog.events.dispatchEvent(this, new goog.events.Event(su.SceneController.SWITCH_SCENE_EVENT));
    //dispatchEvent(new SceneEvent(SceneEvent.WANT_REMOVE));
};
