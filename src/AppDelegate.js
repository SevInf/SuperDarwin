require(['cocos2d', 'scenes/IdleScene'], function(cc, IdleScene) {
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
            cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile('resources/bat.plist');
            cc.SpriteFrameCache.sharedSpriteFrameCache().addSpriteFramesWithFile('resources/spider.plist');

            var director = cc.Director.sharedDirector();
            director.setAnimationInterval(1.0 / 60);

            var scene = IdleScene.create('Click to start', 'resources/title.png');
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
