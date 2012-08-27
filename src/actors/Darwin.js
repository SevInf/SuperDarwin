define(['cocos2d'], function (cc) {
    'use strict';
    /** @const */ var GRAVITY = -360;
    /** @const */ var X_ACCELL = 1000;
    /** @const */ var ANIMATION_TAG = 1;
    /** @const */ var HIT_DISTANCE = 58;
    /** @const */ var HIT_DISTANCE_SQR = HIT_DISTANCE * HIT_DISTANCE;
    /** @const */ var MAX_LIVES = 6;

    var Darwin = cc.Sprite.extend({
        ctor:function () {
            var frameCache = cc.SpriteFrameCache.sharedSpriteFrameCache();

            this.walkAnimation = cc.Animation.create([
                frameCache.spriteFrameByName('walk0.png'),
                frameCache.spriteFrameByName('walk1.png'),
                frameCache.spriteFrameByName('walk2.png'),
                frameCache.spriteFrameByName('walk3.png'),
                frameCache.spriteFrameByName('walk4.png'),
                frameCache.spriteFrameByName('walk5.png'),
                frameCache.spriteFrameByName('walk6.png'),
                frameCache.spriteFrameByName('walk7.png')
            ], 0.15);

            this.idleAnimation = cc.Animation.create([
                frameCache.spriteFrameByName('stay0.png'),
                frameCache.spriteFrameByName('stay1.png')
            ], 0.15);

            this.jumpAnimation = cc.Animation.create([
                frameCache.spriteFrameByName('jump0.png'),
                frameCache.spriteFrameByName('jump1.png'),
                frameCache.spriteFrameByName('jump2.png'),
                frameCache.spriteFrameByName('jump3.png'),
                frameCache.spriteFrameByName('jump4.png'),
                frameCache.spriteFrameByName('jump5.png'),
                frameCache.spriteFrameByName('jump6.png')
            ], 0.2);


            this.attackAnimation = cc.Animation.create([
                frameCache.spriteFrameByName('attack0.png'),
                frameCache.spriteFrameByName('attack1.png'),
                frameCache.spriteFrameByName('attack2.png'),
                frameCache.spriteFrameByName('attack3.png'),
                frameCache.spriteFrameByName('attack4.png')
            ], 0.1);

            this.facingRight = true;
            this.initWithSpriteFrame(frameCache.spriteFrameByName('stay0.png'));
            this.velocity = cc.ccp(0, 0);
            this.xAccel = 0;
            this.onGround = false;
            this.attacking = false;
            this.lives = MAX_LIVES;
            this.regenerating = false;
            this.setAnchorPoint(cc.ccp(0.5, 0));
            this.playAnimation(this.idleAnimation);
        },

        moveAlongX:function (dt) {
            var velocityStep = this.xAccel * dt;
            this.velocity.x = (this.velocity.x + velocityStep) * 0.9;
            var positionStep = this.velocity.x * dt;
            this.setPosition(cc.ccp(this.getPosition().x + positionStep, this.getPosition().y));
        },

        moveAlongY:function (dt) {
            var velocityStep = GRAVITY * dt;
            this.velocity.y += velocityStep;
            var positionStep = this.velocity.y * dt;
            this.setPosition(cc.ccp(this.getPosition().x, this.getPosition().y + positionStep));
        },

        collisionBox:function () {
            var pos = this.getPosition();
            return cc.RectMake(pos.x - 11, pos.y, 22, 69);
        },

        moveRight:function () {
            if (this.attacking) {
                return;
            }
            this.facingRight = true;
            this.xAccel = X_ACCELL;
            this.setFlipX(false);
            if (this.onGround) {
                this.playAnimation(this.walkAnimation);
            }
        },

        moveLeft:function () {
            if (this.attacking) {
                return;
            }
            this.facingRight = false;
            this.xAccel = -X_ACCELL;
            this.setFlipX(true);
            if (this.onGround) {
                this.playAnimation(this.walkAnimation);
            }
        },

        playAnimation:function (animation) {
            if (!this.isAnimationPlaying(animation)) {
                this.stopAnimation();
                var action = cc.RepeatForever.create(cc.Animate.create(animation, false));
                action.setTag(ANIMATION_TAG);
                this.runAction(action);
            }
        },

        isAnimationPlaying:function (animation) {
            var action = this.getActionByTag(ANIMATION_TAG);
            return action && action.getInnerAction().getAnimation() === animation;
        },

        stopAnimation:function () {
            this.stopActionByTag(ANIMATION_TAG);
        },

        stop:function () {
            this.xAccel = 0;
            if (this.onGround && !this.attacking) {
                this.playAnimation(this.idleAnimation);
            }
        },

        jump:function () {
            if (this.onGround) {
                cc.sharedEngine.playEffect('resources/jump');
                this.velocity.y = 330;
                this.onGround = false;
                this.stopAnimation();
                if (!this.attacking) {
                    this.runAction(cc.Animate.create(this.jumpAnimation, false));
                }
            }
        },

        attack:function () {
            if (this.attacking) {
                return;
            }
            cc.sharedEngine.playEffect('resources/hit');
            this.attacking = true;
            this.runAction(cc.Sequence.create(
                cc.Animate.create(this.attackAnimation),
                cc.CallFunc.create(this, function () {
                    this.attacking = false;
                })
            ));
        },

        hitIfPossible:function (object, layer) {
            if (this.isHitPossible(object)) {
                object.hit(layer);
            }
        },

        isHitPossible: function(object) {
            if (!this.yAligned(object)) {
                return false;
            }
            if (this.facingRight && this.getPosition().x < object.getPosition().x) {
                return this.distanceRightSqr(object) < HIT_DISTANCE_SQR;
            } else if (!this.facingRight && this.getPosition().x > object.getPosition().x) {
                return this.distanceLeftSqr(object) < HIT_DISTANCE_SQR;
            }
        },

        yAligned: function(object) {
            var myCB = this.collisionBox();
            var otherCB = object.collisionBox();
            var myMin = cc.Rect.CCRectGetMinY(myCB) + 35,
                myMax = cc.Rect.CCRectGetMaxY(myCB),
                otherMin = cc.Rect.CCRectGetMinY(otherCB),
                otherMax = cc.Rect.CCRectGetMaxY(otherCB);

            return (otherMin > myMin && otherMin < myMax) ||
                (otherMax > myMin && otherMax < myMax);
        },

        distanceLeftSqr:function (object) {
            var dx = this.getPosition().x - cc.Rect.CCRectGetMinX(object.collisionBox());
            return dx * dx;
        },

        distanceRightSqr:function (object) {
            var dx = this.getPosition().x - cc.Rect.CCRectGetMaxX(object.collisionBox());
            return dx * dx;
        },

        hit: function() {
            cc.sharedEngine.playEffect('resources/damage');
            this.regenerating = true;
            this.lives--;
            this.runAction(cc.Sequence.create(
                cc.Blink.create(2, 20),
                cc.CallFunc.create(this, function() {
                    this.regenerating = false;
                })
            ));
        },

        heal: function() {
            if (this.lives < MAX_LIVES) {
                this.lives++;
            }
        }
    });

    Darwin.MAX_LIVES = MAX_LIVES;

    Darwin.create = function () {
        return new Darwin();
    };

    return Darwin;
});