define(['cocos2d'], function(cc) {
    'use strict';
    /** @const */ var SPEED = 125;

    var Snake = cc.Sprite.extend({
        initWithMapObject: function(mapObject) {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();

            var walkAnimation = cc.Animation.create([
                frameCache.spriteFrameByName('snake_stay0.png'),
                frameCache.spriteFrameByName('snake_stay1.png')
            ], 0.3);

            this.dieAnimation = cc.Animation.create([
                frameCache.spriteFrameByName('snake_die0.png'),
                frameCache.spriteFrameByName('snake_die1.png'),
                frameCache.spriteFrameByName('snake_die2.png')
            ], 0.1);

            this.initWithSpriteFrame(frameCache.spriteFrameByName('snake_stay0.png'));
            this.setAnchorPoint(cc.ccp(0.5, 0));
            this.setPosition(cc.ccp(mapObject.x + mapObject.width, mapObject.y));
            var duration = mapObject.width / SPEED;

            var run = cc.Sequence.create(
                cc.MoveBy.create(duration, cc.ccp(-mapObject.width, 0)),
                cc.FlipX.create(true),
                cc.MoveBy.create(duration, cc.ccp(mapObject.width, 0)),
                cc.FlipX.create(false)
            );


            this.dead = false;
            this.runAction(cc.RepeatForever.create(run));
            this.runAction(cc.RepeatForever.create(cc.Animate.create(walkAnimation, false)));

            return true;
        },

        hit: function() {
            if (this.dead) {
                return;
            }
            this.dead = true;
            this.stopAllActions();
            this.runAction(cc.Sequence.create(
                cc.Animate.create(this.dieAnimation, false),
                cc.Blink.create(1, 3),
                cc.CallFunc.create(this, function() {
                    this.removeFromParentAndCleanup(true);
                })
            ));
        },

        collisionBox: function() {
            return cc.RectMake(this.getPosition().x - 20, this.getPosition().y, 40, 36);
        }
    });

    Snake.create = function(mapObject) {
        var node = new Snake();
        if (node && node.initWithMapObject(mapObject)) {
            return node;
        }
        throw new Error('Unable to initialize object');

    };
    return Snake;
});