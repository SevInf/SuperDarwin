require.config({
    paths: {
        'cocos2d': '../lib/Cocos2d-html5-canvasmenu',
        'domReady': '../lib/domReady'
    },
    shim: {
        'cocos2d': {
            exports: 'cc'
        }
    }
});

require(['domReady', 'cocos2d', 'AppDelegate'], function(domReady, cc) {
    'use strict';

    domReady(function() {
        cc.setup("gameCanvas");
        cc.AudioManager.sharedEngine().init("mp3,ogg");

        var loader = cc.Loader.shareLoader();
        loader.onloading = function() {
            cc.LoaderScene.shareLoaderScene().draw();
        };

        loader.onload = function() {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };

        loader.preload([
            {type: 'image', src: 'resources/beach_bg.png'},
            {type: 'image', src: 'resources/beach_fg.png'},
            {type: 'image', src: 'resources/jungle_bg.png'},
            {type: 'image', src: 'resources/jungle_fg.png'},
            {type: 'image', src: 'resources/sleepingSailor.png'},
            {type: 'image', src: 'resources/tiles.png'},
            {type: 'image', src: 'resources/tiles2.png'},

            {type: 'plist', src: 'resources/Darwin.plist'},
            {type: 'image', src: 'resources/Darwin.png'},

            {type: 'tmx', src: 'resources/level0.tmx'},
            {type: 'tmx', src: 'resources/level1.tmx'}
        ]);
    });
});
