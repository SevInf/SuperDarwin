define(['cocos2d', 'scenes/GameScene'], function (cc, GameScene) {
    'use strict';
    var IdleScene = cc.Layer.extend({
        initWithTextBackground: function(text, background) {
            var winSize = cc.Director.sharedDirector().getWinSize();
            var sprite = cc.Sprite.create(background);
            sprite.setPosition(cc.ccp(winSize.width / 2, winSize.height / 2))
            this.addChild(sprite);
            var label = cc.LabelTTF.create(text, 'Press Start 2P', 20);
            label.setAnchorPoint(cc.ccp(0.5, 0));
            label.setPosition(cc.ccp(370, 10));
            label.runAction(cc.RepeatForever.create(cc.Blink.create(1, 1)));
            this.addChild(label);
            this.setIsTouchEnabled(true);
            return true;
        },

        ccTouchesBegan: function() {
            cc.Director.sharedDirector().replaceScene(GameScene.scene());
        }

    });

    IdleScene.node = function(text, background) {
        var node = new IdleScene();
        if (node && node.initWithTextBackground(text, background)) {
            return node;
        }
        throw new Error('Unable to initialize node');
    };

    IdleScene.create = function(text, background) {
        var scene = cc.Scene.create();
        scene.addChild(this.node(text, background));
        return scene;
    };

    return IdleScene;
});