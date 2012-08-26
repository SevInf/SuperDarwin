define(['cocos2d', 'actors/Darwin'], function (cc, Darwin) {
    'use strict';

    var GameScene = cc.Layer.extend({
        init:function () {
            var background = cc.LayerColor.create(cc.ccc4(188, 231, 241, 255));
            this.addChild(background);
            this.map = cc.TMXTiledMap.create('resources/level0.tmx');
            this.walls = this.map.layerNamed('walls');
            this.addChild(this.map);

            var objects = this.map.objectGroupNamed('objects');
            var spawnPoint = objects.objectNamed('Spawn');

            this.player = new Darwin();
            this.player.setPosition(cc.ccp(spawnPoint.x + this.player.getContentSize().width / 2,
                spawnPoint.y));
            this.map.addChild(this.player, spawnPoint.z);
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
                var tile = self.walls.tileGIDAt(tilePos);
                if (tile !== 0) {
                    callback();
                }
            });
        },


        getBottomTiles:function (rect) {
            var minX = Math.floor(cc.Rect.CCRectGetMinX(rect) / this.map.getTileSize().width);
            var maxX = Math.floor(cc.Rect.CCRectGetMaxX(rect) / this.map.getTileSize().width);
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
            var maxX = Math.floor(cc.Rect.CCRectGetMaxX(rect) / this.map.getTileSize().width);
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
            var maxY = Math.floor((this.mapHeight() - cc.Rect.CCRectGetMinY(rect)) / this.map.getTileSize().height) - 1;
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
            var maxY = Math.floor((this.mapHeight() - cc.Rect.CCRectGetMinY(rect)) / this.map.getTileSize().height) - 1;
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

        mapWidth: function() {
            return this.map.getMapSize().width * this.map.getTileSize().width;
        },

        moveCamera: function() {
            var winSize = cc.Director.sharedDirector().getWinSize();
            var playerPos = this.player.getPosition();

            var x = Math.max(winSize.width / 2, playerPos.x);
            var y = Math.max(winSize.height /2, playerPos.y);
            x = Math.min(x, this.mapWidth() - winSize.width / 2);
            y = Math.min(y, this.mapHeight() - winSize.height / 2);

            var viewPoint = cc.ccp(x, y);
            viewPoint = cc.ccpSub(cc.ccp(winSize.width / 2, winSize.height / 2), viewPoint);
            this.map.setPosition(viewPoint);
        },

        checkPortals: function() {
            var nextMap;
            if (this.player.getPosition().x > this.mapWidth()) {
                nextMap = this.map.propertyNamed('leftPortal');
                this.changeMapAndPlacePlayer(nextMap, function(map, player) {
                    player.setPosition(cc.ccp(player.collisionBox().size.width * 0.5,
                                              player.getPosition().y));
                });
            }

            if (this.player.getPosition().x < 0) {
                nextMap = this.map.propertyNamed('rightPortal');
                this.changeMapAndPlacePlayer(nextMap, function(map, player) {
                    var mapWidth = map.getMapSize().width * map.getTileSize().width;
                    player.setPosition(cc.ccp(mapWidth - player.collisionBox().size.width * 0.5,
                                              player.getPosition().y));
                });
            }
        },

        changeMapAndPlacePlayer: function(map, placeFn) {
            if (map) {
                 this.player.removeFromParentAndCleanup(false);
                 this.map.removeFromParentAndCleanup(true);
                 this.map = cc.TMXTiledMap.create(map);
                 this.walls = this.map.layerNamed('walls');
                 this.addChild(this.map);

                 placeFn(this.map, this.player);
                 this.map.addChild(this.player);
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