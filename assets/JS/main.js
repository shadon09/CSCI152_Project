
var fireRate = 100;
var nextFire = 0;
var playerHealth = 100;
var playerXP = 0;
var gameXPsteps = 15;
var playerLevel = 0;

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
			if (collideLeft.length == 0 && Math.abs(xDistance) > 70 && obj.body.blocked.down){
			  obj.body.velocity.x = 0;
			}
			else {
			  obj.body.velocity.x = -200;
			}
		}
		if (xDistance > 25 && xDistance < 300) {
			if (collideRight.length == 0 && Math.abs(xDistance) > 70 && obj.body.blocked.down){
			  obj.body.velocity.x = 0;
			}
			else {
			  obj.body.velocity.x = 200;
			}
		}
		if (xDistance < 15 && xDistance > -15){
			obj.body.velocity.x = 0;
		}

		if ((player.y < (obj.y-32)) && (Math.abs(xDistance) < 70)){
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
				game.physics.arcade.moveToXY(bullet, player.x, player.y-15, 300);
		}
	};

	return obj;
}

//Put the entire state into a variable
var mainState = {
	preload: function(){
  		this.game.load.image('player', 'assets/images/ph_char.png');
		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/images/Tiles_64x64.png');
		this.game.load.image('box', 'assets/images/tile_06.png');
		this.game.load.spritesheet('simpleShootingEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('simpleMeleeEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('bullet', 'assets/images/ph_char.png', 10, 5);
		this.game.load.image('pbullet', 'assets/bullet43.png');
	},


	create: function(){
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
		this.sprite.anchor.setTo(.5, 1);
		this.game.physics.arcade.enable(this.sprite);


		this.pbullets = game.add.group();
		this.pbullets.enableBody = true;
		this.pbullets.physicsBodyType = Phaser.Physics.ARCADE;

	    	this.pbullets.createMultiple(50, 'pbullet');
		this.pbullets.setAll('checkWorldBounds', true);
    		this.pbullets.setAll('outOfBoundsKill', true);

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.setAll('immovable',true);
		this.boxes.setAll('body.moves', false);


		this.simpleMeleeEnemies = this.game.add.group();
		this.simpleShootingEnemies = this.game.add.group();
		simpleMeleeEnemy(this.game, 300, 300, 'simpleMeleeEnemy', this.simpleMeleeEnemies, this.sprite);
		simpleShootingEnemy(this.game, 400, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, this.sprite);
		simpleShootingEnemy(this.game, 700, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, this.sprite);
		simpleShootingEnemy(this.game, 710, 68, 'simpleShootingEnemy', this.simpleShootingEnemies, this.sprite);
		
		this.loseLabel = game.add.text(game.world.centerX, game.world.centerY, "Game Over", {font: '30px Arial', fill: '#ffffff'});
		this.loseLabel.anchor.setTo(0.5, 0.5);
		this.loseLabel.visible = false;
		
		this.map.createFromObjects('Object Layer 1', 7, 'box', 0, true, false, this.boxes);
		//Change the world size to match the size of this layer
		this.groundLayer.resizeWorld();

		//Set some physics on the sprite
		this.sprite.body.bounce.y = 0.2;
		this.sprite.body.gravity.y = 2000;
		this.sprite.body.gravity.x = 20;
		this.sprite.body.velocity.x = 0;

		//Create a running animation for the sprite and play it
		//this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
		//this.sprite.animations.play('right');

		//Make the camera follow the sprite
		this.game.camera.follow(this.sprite);

		//Enable cursor keys so we can create some controls
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function() {
		
		if (game.input.activePointer.isDown){
      			this.fire();
  		}
		//Make the sprite collide with the ground layer
		for (var i = 0; i < this.simpleMeleeEnemies.children.length; i++) {
			this.game.physics.arcade.collide(this.simpleMeleeEnemies.children[i], this.groundLayer);
	  		this.game.physics.arcade.collide(this.simpleMeleeEnemies.children[i], this.boxes, this.destroyBox);
	    		this.simpleMeleeEnemies.children[i].pursue(this.groundLayer);
	  	}

	  	for (var i = 0; i < this.simpleShootingEnemies.children.length; i++) {
	    		this.game.physics.arcade.collide(this.simpleShootingEnemies.children[i], this.groundLayer);
	  		this.game.physics.arcade.collide(this.simpleShootingEnemies.children[i], this.boxes, this.destroyBox);
	    		this.simpleShootingEnemies.children[i].fire();
	    		this.game.physics.arcade.collide(this.sprite, this.simpleShootingEnemies.children[i].getBullets(), this.hitPlayer);
	  	}
		this.game.physics.arcade.collide(this.sprite, this.groundLayer);
		this.game.physics.arcade.collide(this.sprite, this.boxes, this.destroyBox);
		//Make the sprite jump when the up key is pushed
    		if(this.cursors.up.isDown && this.sprite.body.blocked.down) {
      			this.sprite.body.velocity.y = -1000;
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
	},

	destroyBox: function(sprite, box) {
		box.destroy();
	},
	
	hitPlayer: function(sprite, bullet) {
		bullet.destroy();
		//sprite.destroy();
		//this.loseLabel.visible = true;
		//game.input.onTap.addOnce(function(){
		//	game.state.start('title');
		//});
	},


	fire: function(){
		playerXP+=10;
    		if (game.time.now > nextFire && this.pbullets.countDead() > 0){
        		nextFire = game.time.now + fireRate;

        		var pbullet = this.pbullets.getFirstDead();

       			pbullet.reset(this.sprite.x - 8, this.sprite.y - 8);

        		game.physics.arcade.moveToPointer(pbullet, 300);
    		}
	},

	gameOver: function(){
		this.sprite.destroy();
		this.loseLabel.visible = true;
		game.input.onTap.addOnce(function(){
			game.state.start('title');
		});
	}

}


var titleState = {
	preload: function(){
		//Set the background Color
		game.stage.backgroundColor = '#000000';
	},

	create: function(){
		//Add text with value set to "Platformer"
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-125, "Platformer", {font: '50px Arial', fill: '#ffffff'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Add text with value set to "Play"
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-25, "Play", {font: '30px Arial', fill: '#ffffff'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Allow for the "Play" text to be clicked on
		this.labelTitle.inputEnabled = true;
		//If "Play" is clicked on, then start "mainState"
		this.labelTitle.events.onInputDown.add(function(){
			game.state.start('main');
		}, this);
		//If spacebar is pushed, start mainState
		var spaceKey = game.input.keyboard.addKey(
			Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(function(){
			game.state.start('main');
		}, this);
	},

	update: function(){

	},
}

//Create a new game, set the value inside the game variable
var game = new Phaser.Game(800,600);
//Add the mainState
game.state.add('main', mainState);
//Add the titleState
game.state.add('title', titleState);
//Start the game with the titleState
game.state.start('title');
