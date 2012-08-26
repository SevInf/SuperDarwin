define(['cocos2d', 'actors/Enemy'], function (cc, Enemy) {
    'use strict';
    /** @const */ var SPEED = 80;
    /** @const */ var JUMP_LENGTH = 100;

    var Spider = Enemy.extend({
        initWithMapObject:function (mapObject) {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            this.initWithSpriteFrame(frameCache.spriteFrameByName('spider_stay0.png'));
            this.loadMapObject(mapObject);
            return true;
        },

        createIdleAnimation:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            return cc.Animation.create([
                frameCache.spriteFrameByName('spider_stay0.png'),
                frameCache.spriteFrameByName('spider_stay1.png')
            ], 0.3);

        },

        createDieAnimation:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            return cc.Animation.create([
                frameCache.spriteFrameByName('spider_die0.png'),
                frameCache.spriteFrameByName('spider_die1.png'),
                frameCache.spriteFrameByName('spider_die2.png')
            ], 0.1);
        },

        beginMoving:function (mapObject) {
            var duration = mapObject.width / SPEED;
            var jumps = Math.floor(mapObject.width / JUMP_LENGTH);
            var jumpAction = cc.JumpBy.create(duration,
                                              cc.ccp(-mapObject.width, 0),
                                              mapObject.y + mapObject.height,
                                              jumps);

            var run = cc.Sequence.create(
                jumpAction,
                jumpAction.reverse()
            );


            this.runAction(cc.RepeatForever.create(run));
        }
    });

    Spider.create = function (mapObject) {
        var node = new Spider();
        if (node && node.initWithMapObject(mapObject)) {
            return node;
        }
        throw new Error('Unable to initialize object');

    };
    return Spider;
});