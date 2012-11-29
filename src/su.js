//set main namespace
goog.provide('su');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

// entrypoint
su.start = function(){

	var director = new lime.Director(document.body,1024,768);
	var scene = new lime.Scene();

    director.makeMobileWebAppCapable();

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('su.start', helloworld.start);
