define(['cocos2d', 'actors/Enemy'], function (cc, Enemy) {
    'use strict';
    /** @const */ var SPEED = 125;

    var Snake = Enemy.extend({
        initWithMapObject:function (mapObject) {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            this.initWithSpriteFrame(frameCache.spriteFrameByName('snake_stay0.png'));
            this.loadMapObject(mapObject);
            return true;
        },

        createIdleAnimation:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            return cc.Animation.create([
                frameCache.spriteFrameByName('snake_stay0.png'),
                frameCache.spriteFrameByName('snake_stay1.png')
            ], 0.3);

        },

        createDieAnimation:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            return cc.Animation.create([
                frameCache.spriteFrameByName('snake_die0.png'),
                frameCache.spriteFrameByName('snake_die1.png'),
                frameCache.spriteFrameByName('snake_die2.png')
            ], 0.1);
        },

        beginMoving:function (mapObject) {
            var duration = mapObject.width / SPEED;

            var run = cc.Sequence.create(
                cc.MoveBy.create(duration, cc.ccp(-mapObject.width, 0)),
                cc.FlipX.create(true),
                cc.MoveBy.create(duration, cc.ccp(mapObject.width, 0)),
                cc.FlipX.create(false)
            );


            this.runAction(cc.RepeatForever.create(run));
        },

        collisionBox:function () {
            return cc.RectMake(this.getPosition().x - 20, this.getPosition().y, 40, 36);
        }
    });

    Snake.create = function (mapObject) {
        var node = new Snake();
        if (node && node.initWithMapObject(mapObject)) {
            return node;
        }
        throw new Error('Unable to initialize object');

    };
    return Snake;
});