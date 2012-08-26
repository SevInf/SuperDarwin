require(['cocos2d', 'scenes/GameScene'], function(cc, GameScene) {
    'use strict';

    cc.AppDelegate = cc.Application.extend({

        ctor: function() {
            this._super();
        },

        initInstance: function() {
            return true;
        },

        applicationDidFinishLaunching: function() {
            cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile('resources/Darwin.plist');
            cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile('resources/snake.plist');

            var director = cc.Director.sharedDirector();
            director.setDisplayFPS(true);
            director.setAnimationInterval(1.0 / 60);

            var scene = GameScene.scene();
            director.runWithScene(scene);

            return true;
        },

        applicationDidEnterBackground: function() {
            cc.Director.sharedDirector().pause();
        },

        applicationWillEnterForeground: function() {
            cc.Director.sharedDirector().resume();
        }
    });
});
