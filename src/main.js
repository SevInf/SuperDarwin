require.config({
    paths:{
        'cocos2d':'../lib/Cocos2d-html5-canvasmenu',
        'domReady':'../lib/domReady'
    },
    shim:{
        'cocos2d':{
            exports:'cc'
        }
    }
});

require(['domReady', 'cocos2d', 'scenes/PauseScene', 'AppDelegate'], function (domReady, cc, PauseScene) {
    'use strict';


    var pauseGame = function () {
        var scene = cc.Director.sharedDirector().getRunningScene();
        if (scene && !scene.isPause) {
            cc.Director.sharedDirector().pushScene(PauseScene.create());
        }
    };

    var unpauseGame = function () {
        var scene = cc.Director.sharedDirector().getRunningScene();
        if (scene && scene.isPause) {
            cc.Director.sharedDirector().popScene();
        }
    };

    var setupFocusEvents = function (canvas) {
        canvas.addEventListener('blur', pauseGame, false);
        canvas.addEventListener('focus', unpauseGame, false);
    };

    domReady(function () {
        cc.setup("gameCanvas");
        cc.AudioManager.sharedEngine().init("mp3,ogg,wav");

        var loader = cc.Loader.shareLoader();
        loader.onloading = function () {
            cc.LoaderScene.shareLoaderScene().draw();
        };

        loader.onload = function () {
            var canvas = document.getElementById('gameCanvas');
            setupFocusEvents(canvas);
            canvas.focus();
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };

        loader.preload([
            {type:'image', src:'resources/beach_bg.png'},
            {type:'image', src:'resources/beach_fg.png'},
            {type:'image', src:'resources/jungle_bg.png'},
            {type:'image', src:'resources/jungle_fg.png'},
            {type:'image', src:'resources/tiles_cave.png'},
            {type:'image', src:'resources/tiles_cave_bg.png'},
            {type:'image', src:'resources/tiles2.png'},
            {type:'image', src:'resources/cave_background.png'},
            {type:'image', src:'resources/cave_beach_bg.png'},
            {type:'image', src:'resources/skull0.png'},
            {type:'image', src:'resources/skull2.png'},
            {type:'image', src:'resources/skull3.png'},
            {type:'image', src:'resources/skull4.png'},
            {type:'image', src:'resources/skull5.png'},
            {type:'image', src:'resources/hearts.png'},
            {type:'image', src:'resources/title.png'},
            {type:'image', src:'resources/win.png'},
            {type:'image', src:'resources/lose.png'},
            {type:'image', src:'resources/heart.png'},

            {type:'plist', src:'resources/Darwin.plist'},
            {type:'image', src:'resources/Darwin.png'},

            {type:'plist', src:'resources/snake.plist'},
            {type:'image', src:'resources/snake.png'},
            {type:'plist', src:'resources/bat.plist'},
            {type:'image', src:'resources/bat.png'},
            {type:'plist', src:'resources/spider.plist'},
            {type:'image', src:'resources/spider.png'},

            {type:'tmx', src:'resources/level0.tmx'},
            {type:'tmx', src:'resources/level1.tmx'},
            {type:'tmx', src:'resources/cave00.tmx'},
            {type:'tmx', src:'resources/cave01.tmx'},
            {type:'tmx', src:'resources/cave02.tmx'},
            {type:'tmx', src:'resources/cave03.tmx'},
            {type:'tmx', src:'resources/cave04.tmx'},
            {type:'tmx', src:'resources/cave05.tmx'},
            {type:'tmx', src:'resources/cave06.tmx'},
            {type:'tmx', src:'resources/cave07.tmx'},
            {type:'tmx', src:'resources/cave08.tmx'},
            {type:'tmx', src:'resources/cave09.tmx'},
            {type:'tmx', src:'resources/cave10.tmx'},
            {type:'tmx', src:'resources/cave11.tmx'},
            {type:'tmx', src:'resources/cave12.tmx'},
            {type:'tmx', src:'resources/cave13.tmx'},
            {type:'tmx', src:'resources/cave14.tmx'},
            {type:'tmx', src:'resources/cave15.tmx'},
            {type:'tmx', src:'resources/cave16.tmx'},
            {type:'tmx', src:'resources/cave17.tmx'},

            {type:'bgm', src:'resources/bgm'},
            {type:'effect', src:'resources/hit'},
            {type:'effect', src:'resources/damage'},
            {type:'effect', src:'resources/jump'},
            {type:'effect', src:'resources/pick'}
        ]);
    });
});
