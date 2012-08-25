define(['cocos2d'], function (cc) {
    'use strict';
    /** @const */ var GRAVITY = -160;
    /** @const */ var X_ACCELL = 1000;

    var Darwin = cc.Sprite.extend({
        ctor: function() {
            this.initWithFile('resources/Darwin.png');
            this.velocity = cc.ccp(0, 0);
            this.xAccel = 0;
            this.onGround = false;
            this.setAnchorPoint(cc.ccp(0.5, 0));
        },

        moveAlongX: function(dt) {
            var velocityStep = this.xAccel * dt;
            this.velocity.x = (this.velocity.x + velocityStep) * 0.9;
            var positionStep = this.velocity.x * dt;
            this.setPosition(cc.ccp(this.getPosition().x + positionStep, this.getPosition().y));
        },

        moveAlongY: function(dt) {
            var velocityStep = GRAVITY * dt;
            this.velocity.y += velocityStep;
            var positionStep = this.velocity.y * dt;
            this.setPosition(cc.ccp(this.getPosition().x, this.getPosition().y + positionStep));
        },

        collisionBox: function() {
            var pos = this.getPosition();
            var size = this.getContentSize();
            return cc.RectMake(pos.x - 15, pos.y, 30, size.height);
        },

        moveRight: function() {
            this.xAccel = X_ACCELL;
        },

        moveLeft: function() {
            this.xAccel = -X_ACCELL;
        },

        stop: function() {
            this.xAccel = 0;
        },

        jump: function() {
            if (this.onGround) {
                this.velocity.y = 180;
                this.onGround = false;
            }
        }
    });

    Darwin.create = function() {
        return new Darwin();
    };

    return Darwin;
});