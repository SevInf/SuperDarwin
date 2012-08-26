define(['cocos2d'], function (cc) {
    'use strict';

    var Skull = cc.Sprite.extend({
        initWithMapObject: function(mapObject) {
            this.name = mapObject.name;
            this.initWithFile('resources/' + mapObject.name + '.png');
            this.setPosition(cc.ccp(mapObject.x, mapObject.y));
            return true;
        },

        collisionBox: function() {
            return this.boundingBox();
        },

        collect: function(gameLayer) {
            gameLayer.skulls.push(this.name);
            var winSize = cc.Director.sharedDirector().getWinSize();
            this.runAction(cc.Sequence.create(
                cc.MoveTo.create(0.5, cc.ccp(winSize.width + this.getContentSize().width / 2,
                                            winSize.height + this.getContentSize().height / 2)),
                cc.CallFunc.create(this, function() {
                    this.removeFromParentAndCleanup(true);
                })
            ));
        }
    });

    Skull.create = function(mapObject) {
        var node = new Skull();
        if (node && node.initWithMapObject(mapObject)) {
            return node;
        }
        throw new Error('Unable to initialize skull');
    }
    return Skull;
});