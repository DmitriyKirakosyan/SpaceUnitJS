//set main namespace
goog.provide('su');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('su.SceneController');

// entrypoint
su.start = function(){

    var director = new lime.Director(document.body,600,600);
    var scene = new lime.Scene();

    director.makeMobileWebAppCapable();


//    var size = 150;
//    var circle = new lime.Circle().setSize(size, size).setFill(255,150,0);
//    scene.appendChild(circle);


    new su.SceneController(scene);

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('su.start', su.start);
