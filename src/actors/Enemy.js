define(['cocos2d', 'actors/Heart'], function (cc, Heart) {
    'use strict';
    var Enemy = cc.Sprite.extend({
        loadMapObject:function (mapObject) {
            this.dieAnimation = this.createDieAnimation();
            this.createIdleAnimation();
            this.setAnchorPoint(cc.ccp(0.5, 0));
            this.setPosition(cc.ccp(mapObject.x + mapObject.width, mapObject.y));
            this.dead = false;
            this.beginMoving(mapObject);
            var idleAnimation = this.createIdleAnimation();
            this.runAction(cc.RepeatForever.create(cc.Animate.create(idleAnimation, false)));
        },

        createDieAnimation:function () {
            throw new Error('Subclass should override this method');
        },

        createIdleAnimation:function () {
            throw new Error('Subclass should override this method');
        },

        beginMoving:function (mapObject) {
            throw new Error('Subclass should override this method');
        },

        collisionBox:function () {
            return this.boundingBox();
        },

        hit:function (layer) {
            if (this.dead) {
                return;
            }
            this.dead = true;
            this.stopAllActions();
            this.runAction(cc.Sequence.create(
                cc.Animate.create(this.dieAnimation, false),
                cc.Blink.create(1, 3),
                cc.CallFunc.create(this, function () {
                    this.removeFromParentAndCleanup(true);
                    this.produceHeart(layer);
                })
            ));
        },

        produceHeart:function (layer) {
            var rnd = Math.floor(Math.random() * 10);
            if (rnd === 1) {
                var heart = Heart.create();
                heart.setPosition(this.getPosition());
                layer.map.addChild(heart, layer.objectsZ);
                layer.items.push(heart);
            }

        }

    });

    return Enemy;
});