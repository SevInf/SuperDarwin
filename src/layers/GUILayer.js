define(['cocos2d', 'actors/Darwin'], function (cc, Darwin) {
    'use strict';
    var GUILayer = cc.Layer.extend({
        init: function() {
            var winSize = cc.Director.sharedDirector().getWinSize();
            this.lives = cc.ProgressTimer.create('resources/hearts.png');
            this.lives.setType(cc.CCPROGRESS_TIMER_TYPE_HORIZONTATAL_BAR_LR);
            this.lives.setAnchorPoint(cc.ccp(0, 1.0));
            this.lives.setPercentage(100);
            this.lives.setPosition(cc.ccp(5, winSize.height - 5));
            this.addChild(this.lives);

            var skull = cc.Sprite.create('resources/skull5.png');
            skull.setAnchorPoint(cc.ccp(1, 1));
            skull.setPosition(cc.ccp(winSize.width - 60, winSize.height - 5));
            this.addChild(skull);

            this.skullCount = cc.LabelTTF.create('0/6', 'Press Start 2P', 15);
            this.skullCount.setAnchorPoint(cc.ccp(0, 0.5));
            this.skullCount.setPosition(cc.ccp(winSize.width - 55,
                                               skull.getPosition().y - skull.getContentSize().height / 2));
            this.addChild(this.skullCount);


            return true;
        },

        setLives: function(lives) {
            this.lives.setPercentage(lives / Darwin.MAX_LIVES * 100);
        },

        setSkulls: function(skulls) {
            this.skullCount.setString(skulls + '/6');
        }
    });

    GUILayer.create = function() {
        var node = new GUILayer();
        if (node &&  node.init()) {
            return node;
        }
        throw new Error('Unable to initialize node');
    };

    return GUILayer;
});