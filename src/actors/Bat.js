define(['cocos2d', 'actors/Enemy'], function (cc, Enemy) {
    'use strict';
    var SPEED = 150;
    var Bat = Enemy.extend({
        initWithMapObject:function (mapObject) {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            this.initWithSpriteFrame(frameCache.spriteFrameByName('bat_stay0.png'));
            this.loadMapObject(mapObject);
            return true;
        },

        createIdleAnimation:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            return cc.Animation.create([
                frameCache.spriteFrameByName('bat_stay0.png'),
                frameCache.spriteFrameByName('bat_stay1.png')
            ], 0.3);

        },

        createDieAnimation:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();
            return cc.Animation.create([
                frameCache.spriteFrameByName('bat_die0.png'),
                frameCache.spriteFrameByName('bat_die1.png'),
                frameCache.spriteFrameByName('bat_die2.png')
            ], 0.1);
        },

        beginMoving:function (mapObject) {
            if (mapObject.width > mapObject.height) {
                this.moveHorizontaly(mapObject);
            } else {
                this.moveVerticaly(mapObject);
            }
        },

        moveHorizontaly:function (mapObject) {

            var duration = mapObject.width / SPEED;

            var run = cc.Sequence.create(
                cc.MoveBy.create(duration, cc.ccp(-mapObject.width, 0)),
                cc.MoveBy.create(duration, cc.ccp(mapObject.width, 0))
            );

            this.runAction(cc.RepeatForever.create(run));

        },

        moveVerticaly:function (mapObject) {

            var duration = mapObject.height / SPEED;

            var run = cc.Sequence.create(
                cc.MoveBy.create(duration, cc.ccp(0, mapObject.height)),
                cc.MoveBy.create(duration, cc.ccp(0, -mapObject.height))
            );

            this.runAction(cc.RepeatForever.create(run));

        }
    });

    Bat.create = function (mapObject) {
        var node = new Bat();
        if (node && node.initWithMapObject(mapObject)) {
            return node;
        }
        throw new Error('Unable to initialize object');

    };
    return Bat;
});