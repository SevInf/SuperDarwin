define(['cocos2d'], function (cc) {
    'use strict';

    var Heart = cc.Sprite.extend({
        initHeart: function() {
            this.initWithFile('resources/heart.png');
            this.setAnchorPoint(cc.ccp(0.5, 0));
            this.collected = false;
            return true;
        },

        collisionBox: function() {
            return this.boundingBox();
        },

        collect: function(gameLayer) {
            if (this.collected) {
                return;
            }
            cc.sharedEngine.playEffect('resources/pick');
            this.collected = true;
            var winSize = cc.Director.sharedDirector().getWinSize();
            this.runAction(cc.Sequence.create(
                cc.MoveTo.create(0.5, cc.ccp(-this.getContentSize().width / 2,
                                            winSize.height + this.getContentSize().height / 2)),
                cc.CallFunc.create(this, function() {
                    gameLayer.player.heal();
                    this.removeFromParentAndCleanup(true);
                })
            ));
        }
    });

    Heart.create = function() {
        var node = new Heart();
        if (node && node.initHeart()) {
            return node;
        }
        throw new Error('Unable to initialize heart');
    };
    return Heart;
});