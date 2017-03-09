var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  this.game.load.spritesheet('bullet', 'assets/images/ph_char.png', 10, 5);
  this.game.load.spritesheet('simpleShootingEnemy', 'assets/images/ph_char.png', 32, 48);
  this.game.load.spritesheet('simpleMeleeEnemy', 'assets/images/ph_char.png', 32, 48);
  this.game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
	this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('tiles', 'assets/images/Tiles_64x64.png');
	this.game.load.image('box', 'assets/images/tile_06.png');
}


function simpleMeleeEnemy(game, x, y, key, group, player){
  var obj = game.add.sprite(x, y, key, 0, group);
  game.physics.arcade.enable(obj);

  obj.body.bounce.y = 0.2;
	obj.body.gravity.y = 1000;
	obj.body.gravity.x = 0;
	obj.body.velocity.x = 0;

  obj.jump = function() {
    if (obj.body.blocked.down) {
      obj.body.velocity.y = -650;
    }
  }

  obj.pursue = function(layer) {
    var collideLeft = layer.getTiles(obj.x-30, obj.y+60, 32, 48, true);
    var collideRight = layer.getTiles(obj.x+30, obj.y+60, 32, 48, true);

    var xDistance = player.x - obj.x;
    var yDistance = player.y - obj.y;

    if (xDistance < -25 && xDistance > -300) {
      //if (collideLeft.length == 0){
      //  obj.collideDown(layer, obj.x-30);
      //  obj.body.velocity.x = 0;
      //}
      //else {
      //  obj.body.velocity.x = -300;
      //}
      obj.body.velocity.x = -300;
    }
    if (xDistance > 25 && xDistance < 300) {
      //if (collideRight.length == 0){
      //  obj.body.velocity.x = 0;
      //}
      //else {
      //  obj.body.velocity.x = 300;
      //}
      obj.body.velocity.x = 300;
    }
    if (xDistance < 25 && xDistance > -25){
      obj.body.velocity.x = 0;
    }

    if ((player.y < (obj.y-32)) && (Math.abs(xDistance) < 40)){
      obj.jump();
    }

  };

  return obj;
}

function simpleShootingEnemy(game, x, y, key, group, player){
  var fireRate = 500;
  var nextFire = 0;

  var bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

  var obj = game.add.sprite(x, y, key, 0, group);
  game.physics.arcade.enable(obj);

  obj.body.bounce.y = 0.2;
	obj.body.gravity.y = 1000;
	obj.body.gravity.x = 0;
	obj.body.velocity.x = 0;

  obj.getBullets = function() {
    return bullets;
  }

  obj.fire = function() {
    var xDistance = Math.abs(player.x - obj.x);
    var yDistance = Math.abs(player.y - obj.y);

    if (game.time.now > nextFire && xDistance < 500 && yDistance < 500)
    {
        nextFire = game.time.now + fireRate;
        var bullet = game.add.sprite(obj.x, obj.y+10, 'bullet', 0, bullets);
        game.physics.arcade.moveToXY(bullet, player.x, player.y+20, 300);
    }
  };

  return obj;
}

var boxes
var simpleMeleeEnemies
var simpleShootingEnemies

function create() {
	//Start the Arcade Physics systems
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	//Change the background colour
	this.game.stage.backgroundColor = "#a9f0ff";

	//Add the tilemap and tileset image. The first parameter in addTilesetImage
	//is the name you gave the tilesheet when importing it into Tiled, the second
	//is the key to the asset in Phaser
	this.map = this.game.add.tilemap('tilemap');
	this.map.addTilesetImage('Tiles_64x64', 'tiles');

	//Add both the background and ground layers. We won't be doing anything with the
	//GroundLayer though
	this.backgroundlayer = this.map.createLayer('Background');
	this.groundLayer = this.map.createLayer('Ground');

	//Before you can use the collide function you need to set what tiles can collide
	this.map.setCollisionBetween(1, 100, true, 'Ground');

	//Add the sprite to the game and enable arcade physics on it
	this.sprite = this.game.add.sprite(50, this.game.world.centerY, 'player');
	this.game.physics.arcade.enable(this.sprite);

  simpleMeleeEnemies = this.game.add.group();
  simpleShootingEnemies = this.game.add.group();
  simpleMeleeEnemy(game, 300, 300, 'simpleMeleeEnemy', simpleMeleeEnemies, this.sprite);
  simpleShootingEnemy(game, 400, 300, 'simpleShootingEnemy', simpleShootingEnemies, this.sprite);
  simpleShootingEnemy(game, 700, 300, 'simpleShootingEnemy', simpleShootingEnemies, this.sprite);
  simpleShootingEnemy(game, 710, 68, 'simpleShootingEnemy', simpleShootingEnemies, this.sprite);


	boxes = this.game.add.group();
	boxes.enableBody = true;
	boxes.setAll('immovable',true);
	boxes.setAll('body.moves', false);

	this.map.createFromObjects('Object Layer 1', 7, 'box', 0, true, false, boxes);
	//Change the world size to match the size of this layer
	this.groundLayer.resizeWorld();

	//Set some physics on the sprite
	this.sprite.body.bounce.y = 0.2;
	this.sprite.body.gravity.y = 1000;
	this.sprite.body.gravity.x = 20;
	this.sprite.body.velocity.x = 0;

	//Create a running animation for the sprite and play it
	this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
	this.sprite.animations.play('right');

	//Make the camera follow the sprite
	this.game.camera.follow(this.sprite);

	//Enable cursor keys so we can create some controls
	this.cursors = this.game.input.keyboard.createCursorKeys();
}

function update() {

  for (var i = 0; i < simpleMeleeEnemies.children.length; i++) {
    this.game.physics.arcade.collide(simpleMeleeEnemies.children[i], this.groundLayer);
  	this.game.physics.arcade.collide(simpleMeleeEnemies.children[i], boxes, destroyBox);
    simpleMeleeEnemies.children[i].pursue(this.groundLayer);
  }

  for (var i = 0; i < simpleShootingEnemies.children.length; i++) {
    this.game.physics.arcade.collide(simpleShootingEnemies.children[i], this.groundLayer);
  	this.game.physics.arcade.collide(simpleShootingEnemies.children[i], boxes, destroyBox);
    simpleShootingEnemies.children[i].fire();
    this.game.physics.arcade.collide(this.sprite, simpleShootingEnemies.children[i].getBullets(), hitPlayer);
  }
	//Make the sprite collide with the ground layer
	this.game.physics.arcade.collide(this.sprite, this.groundLayer);
	this.game.physics.arcade.collide(this.sprite, boxes, destroyBox);
	//Make the sprite jump when the up key is pushed
  if(this.cursors.up.isDown && this.sprite.body.blocked.down) {
    this.sprite.body.velocity.y = -650;
  }
	if(this.cursors.right.isDown) {
		this.sprite.body.velocity.x = 250;
		this.sprite.scale.setTo(1, 1);
	}
	else if(this.cursors.left.isDown) {
		this.sprite.body.velocity.x = -250;
		this.sprite.scale.setTo(-1, 1);
	}
	else {
		this.sprite.body.velocity.x = 0;
	}
}

destroyBox: function(sprite, box) {
		box.destroy();
	}
}

function hitPlayer(sprite, bullet) {
  bullet.destroy();
}
