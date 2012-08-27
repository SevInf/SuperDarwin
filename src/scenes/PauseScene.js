define(['cocos2d'], function (cc) {
    'use strict';
    var PauseScene = cc.Layer.extend({
        init:function () {
            var winSize = cc.Director.sharedDirector().getWinSize();
            var label = cc.LabelTTF.create('Click to unpause', 'Press Start 2P', 20);

            label.setPosition(winSize.width / 2, winSize.height / 2);
            this.addChild(label);
            return true;
        },

        onEnter: function() {
            this._super();
            cc.sharedEngine.stopAllEffects();
            if (cc.sharedEngine.isBackgroundMusicPlaying()) {
                cc.sharedEngine.pauseBackgroundMusic();
                this.restoreMusic = true;
            }

        },

        onExit: function() {
            this._super();
            cc.sharedEngine.resumeAllEffects();
            if (this.restoreMusic) {
                cc.sharedEngine.resumeBackgroundMusic();
            }
        }
    });

    PauseScene.node = function () {
        var node = new PauseScene();
        if (node && node.init()) {
            return node;
        }
        throw new Error('Unable to initialize node');
    };

    PauseScene.create = function () {
        var scene = cc.Scene.create();
        scene.addChild(this.node());
        scene.isPause = true;
        return scene;
    };

    return PauseScene;
});