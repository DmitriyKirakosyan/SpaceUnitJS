goog.provide('su.SceneController');

goog.require('su.MenuScene');
goog.require('su.GameScene');
goog.require('su.GameModeID');

/**
 * @param scene игровая сцена
 * @constructor
 */
su.SceneController = function(scene)
{
    su.SceneController.SWITCH_SCENE_EVENT = 'switch_scene';

    this._menuScene = new su.MenuScene(scene);
    this._gameScene = new su.GameScene(scene);

    goog.events.listen(this._menuScene, su.SceneController.SWITCH_SCENE_EVENT, this.onSceneChangeFromMenu, false, this);
    goog.events.listen(this._gameScene, su.SceneController.SWITCH_SCENE_EVENT, this.onSceneChangeFromGame, false, this);

    this._menuScene.open();
};

su.SceneController.prototype.onSceneChangeFromMenu = function(event) {
    this._menuScene.remove();
    this._gameScene.gameMode = this._menuScene.gameMode;
    this._gameScene.open();
};

su.SceneController.prototype.onSceneChangeFromGame = function(event) {
    this._gameScene.remove();
    this._menuScene.open();
};
