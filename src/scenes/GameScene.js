define(['cocos2d', 'actors/Darwin', 'actors/enemies', 'actors/Skull'], function (cc, Darwin, enemies, Skull) {
    'use strict';

    /** @const */ var COLORS = {
        SKY:cc.ccc4(188, 231, 241, 255),
        CAVE:cc.ccc4(0, 0, 0, 255),
    }

    var GameScene = cc.Layer.extend({
        init:function () {
            this.background = cc.LayerColor.create(COLORS.SKY);
            this.addChild(this.background);
            this.player = new Darwin();
            this.skulls = [];
            this.changeMapAndPlacePlayer('resources/level0.tmx', function (map, player) {
                var objects = map.objectGroupNamed('objects');
                var spawnPoint = objects.objectNamed('Spawn');
                player.setPosition(cc.ccp(spawnPoint.x + player.getContentSize().width / 2,
                    spawnPoint.y));
            });

            this.keys = {};
            this.setIsKeypadEnabled(true);
            this.scheduleUpdate();
            return true;
        },

        keyDown:function (key) {
            this.keys[key] = true;
        },

        keyUp:function (key) {
            this.keys[key] = false;
        },

        update:function (dt) {
            if (this.keys[cc.KEY.right]) {
                this.player.moveRight();
            } else if (this.keys[cc.KEY.left]) {
                this.player.moveLeft();
            } else {
                this.player.stop();
            }

            if (this.keys[cc.KEY.z] || this.keys[cc.KEY.w]) {
                this.player.jump();
            }

            if (this.keys[cc.KEY.x]) {
                this.player.attack();
            }
            this.player.update(dt);
            this.movePlayer(dt);
            this.moveCamera();
            this.checkEnemiesHit();
            this.checkPlayerHit();
            this.checkItemsCollisions();
            this.checkPortals();
        },

        movePlayer:function (dt) {
            var self = this;

            this.player.moveAlongX(1 / 60);
            var leftTiles = this.getLeftTiles(this.player.collisionBox());
            this.collide(leftTiles, function () {
                self.player.setPosition(cc.ccp(leftTiles.baseline + self.player.collisionBox().size.width * 0.5,
                    self.player.getPosition().y));
                self.player.velocity.x = 0;
            });

            var rightTiles = this.getRightTiles(this.player.collisionBox());
            this.collide(rightTiles, function () {
                self.player.setPosition(cc.ccp(rightTiles.baseline - self.player.collisionBox().size.width * 0.5,
                    self.player.getPosition().y));
                self.player.velocity.x = 0;
            });

            this.player.moveAlongY(1 / 60);
            var bottomTiles = this.getBottomTiles(this.player.collisionBox());
            this.collide(bottomTiles, function () {
                self.player.setPosition(cc.ccp(self.player.getPosition().x, bottomTiles.baseline));
                self.player.onGround = true;
                self.player.velocity.y = 0;
            });

            var topTiles = this.getTopTiles(this.player.collisionBox());
            this.collide(topTiles, function () {
                self.player.setPosition(cc.ccp(self.player.getPosition().x,
                    topTiles.baseline - self.player.collisionBox().size.height));
                self.player.velocity.y = 0;
            });
        },

        collide:function (tileInfo, callback) {
            var self = this;
            tileInfo.tiles.forEach(function (tilePos) {
                if (tilePos.x >= 0 && tilePos.x < self.walls.getLayerSize().width &&
                    tilePos.y >= 0 && tilePos.y < self.walls.getLayerSize().height) {
                    var tile = self.walls.tileGIDAt(tilePos);
                    if (tile) {
                        callback();
                    }
                }

            });
        },


        getBottomTiles:function (rect) {
            var minX = Math.floor(cc.Rect.CCRectGetMinX(rect) / this.map.getTileSize().width);
            var maxXf = cc.Rect.CCRectGetMaxX(rect) / this.map.getTileSize().width;
            var maxX = Math.floor(maxXf);
            if (maxX === maxXf) {
                maxX--;
            }
            var y = Math.floor((this.mapHeight() - cc.Rect.CCRectGetMinY(rect)) / this.map.getTileSize().height);
            var tilesInfo = {
                baseline:this.mapHeight() - y * this.map.getTileSize().height,
                tiles:[]
            };
            for (var x = minX; x <= maxX; x++) {
                tilesInfo.tiles.push(
                    cc.ccp(x, y)
                );
            }
            return tilesInfo;
        },

        getTopTiles:function (rect) {
            var minX = Math.floor(cc.Rect.CCRectGetMinX(rect) / this.map.getTileSize().width);
            var maxXf = cc.Rect.CCRectGetMaxX(rect) / this.map.getTileSize().width;
            var maxX = Math.floor(maxXf);
            if (maxX === maxXf) {
                maxX--;
            }
            var y = Math.floor((this.mapHeight() - cc.Rect.CCRectGetMaxY(rect)) / this.map.getTileSize().height);
            var tilesInfo = {
                baseline:this.mapHeight() - (y + 1) * this.map.getTileSize().height,
                tiles:[]
            };

            for (var x = minX; x <= maxX; x++) {
                tilesInfo.tiles.push(
                    cc.ccp(x, y)
                );
            }
            return tilesInfo;
        },

        getLeftTiles:function (rect) {
            var maxYf = (this.mapHeight() - cc.Rect.CCRectGetMinY(rect)) / this.map.getTileSize().height;
            var maxY = Math.floor(maxYf);
            if (maxY === maxYf) {
                maxY--;
            }
            var minY = Math.floor((this.mapHeight() - cc.Rect.CCRectGetMaxY(rect)) / this.map.getTileSize().height);
            var x = Math.floor(cc.Rect.CCRectGetMinX(rect) / this.map.getTileSize().width);
            var tilesInfo = {
                baseline:(x + 1) * this.map.getTileSize().width,
                tiles:[]
            };
            for (var y = minY; y <= maxY; y++) {
                tilesInfo.tiles.push(
                    cc.ccp(x, y)
                );
            }
            return tilesInfo;
        },

        getRightTiles:function (rect) {
            var maxYf = (this.mapHeight() - cc.Rect.CCRectGetMinY(rect)) / this.map.getTileSize().height;
            var maxY = Math.floor(maxYf);
            if (maxY === maxYf) {
                maxY--;
            }
            var minY = Math.floor((this.mapHeight() - cc.Rect.CCRectGetMaxY(rect)) / this.map.getTileSize().height);
            var x = Math.floor(cc.Rect.CCRectGetMaxX(rect) / this.map.getTileSize().width);
            var tilesInfo = {
                baseline:x * this.map.getTileSize().width,
                tiles:[]
            };
            for (var y = minY; y <= maxY; y++) {
                tilesInfo.tiles.push(
                    cc.ccp(x, y)
                );
            }
            return tilesInfo;
        },

        mapHeight:function () {
            return this.map.getMapSize().height * this.map.getTileSize().height;
        },

        mapWidth:function () {
            return this.map.getMapSize().width * this.map.getTileSize().width;
        },

        moveCamera:function () {
            var winSize = cc.Director.sharedDirector().getWinSize();
            var playerPos = this.player.getPosition();

            var x = Math.max(winSize.width / 2, playerPos.x);
            var y = Math.max(winSize.height / 2, playerPos.y);
            x = Math.min(x, this.mapWidth() - winSize.width / 2);
            y = Math.min(y, this.mapHeight() - winSize.height / 2);

            var viewPoint = cc.ccp(x, y);
            viewPoint = cc.ccpSub(cc.ccp(winSize.width / 2, winSize.height / 2), viewPoint);
            this.map.setPosition(viewPoint);
        },

        checkEnemiesHit:function () {
            if (this.player.attacking) {
                var self = this;
                this.enemies.forEach(function (enemy) {
                    self.player.hitIfPossible(enemy);
                });
            }
        },

        checkPlayerHit:function () {
            if (this.player.regenerating) {
                return;
            }
            var self = this;
            this.enemies.forEach(function (enemy) {
                if (!enemy.dead) {
                    if (cc.Rect.CCRectIntersectsRect(self.player.collisionBox(), enemy.collisionBox())) {
                        self.player.hit();
                    }
                }
            });
        },

        checkItemsCollisions:function () {
            var self = this;
            this.items.forEach(function (item) {
                if (cc.Rect.CCRectIntersectsRect(self.player.collisionBox(), item.collisionBox())) {
                    item.collect(self);
                }
            });
        },

        checkPortals:function () {
            var nextMap;
            if (this.player.getPosition().x > this.mapWidth()) {
                nextMap = this.map.propertyNamed('rightPortal');
                this.changeMapAndPlacePlayer(nextMap, function (map, player) {
                    player.setPosition(cc.ccp(player.collisionBox().size.width * 0.5 + 10,
                        player.getPosition().y));
                });
            } else if (this.player.getPosition().x < 0) {
                nextMap = this.map.propertyNamed('leftPortal');
                this.changeMapAndPlacePlayer(nextMap, function (map, player) {
                    var mapWidth = map.getMapSize().width * map.getTileSize().width;
                    player.setPosition(cc.ccp(mapWidth - player.collisionBox().size.width * 0.5 - 10,
                        player.getPosition().y + 0.1));
                });
            } else if (this.player.getPosition().y < 0) {
                nextMap = this.map.propertyNamed('bottomPortal');
                this.changeMapAndPlacePlayer(nextMap, function (map, player) {
                    var mapHeight = map.getMapSize().height * map.getTileSize().height;
                    player.setPosition(cc.ccp(player.getPosition().x,
                        mapHeight - 10));
                });
            } else if (this.player.getPosition().y > this.mapHeight()) {
                nextMap = this.map.propertyNamed('topPortal');
                this.changeMapAndPlacePlayer(nextMap, function (map, player) {
                    player.setPosition(cc.ccp(player.getPosition().x, 10));
                });
            }
        },

        changeMapAndPlacePlayer:function (map, placeFn) {
            if (map) {
                if (this.player.getParent()) {
                    this.player.removeFromParentAndCleanup(false);
                }
                if (this.map) {
                    this.map.removeFromParentAndCleanup(true);
                }

                this.map = cc.TMXTiledMap.create(map);

                var background = COLORS[this.map.propertyNamed('background')];
                if (!background) {
                    background = COLORS.CAVE;
                }

                this.background.setColor(background);

                this.enemies = [];
                this.items = [];
                var objects = this.map.objectGroupNamed('objects');
                var self = this;
                objects.getObjects().forEach(function (objectData) {
                    console.log(objectData);
                    var object;
                    var EnemyClass = enemies[objectData.type];
                    if (typeof EnemyClass !== 'undefined') {
                        object = EnemyClass.create(objectData);
                        self.enemies.push(object);
                    } else {
                        if (objectData.name.indexOf('skull') === 0 && self.skulls.indexOf(objectData.name) === -1) {
                            object = Skull.create(objectData);
                            self.items.push(object);
                        }
                    }
                    if (object) {
                        self.map.addChild(object, objectData.z);
                    }
                });

                this.walls = this.map.layerNamed('walls');
                this.addChild(this.map);

                placeFn(this.map, this.player);
                this.map.addChild(this.player, 1);
            }

        }
    });

    GameScene.create = function () {
        var node = new GameScene();
        if (node && node.init()) {
            return node;
        }
        throw new Error('Unable to initialize scene');
    };

    GameScene.scene = function () {
        var scene = cc.Scene.create();
        var layer = this.create();
        scene.addChild(layer);
        return scene;
    };

    return GameScene;
});