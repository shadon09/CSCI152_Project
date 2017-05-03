var fireRate = 100;
var nextFire = 0;
var playerHealth = 100;
var playerXP = 0;
var gameXPsteps = 15;
var playerLevel = 0;

//Put the entire state into a variable
var mainState = {
	preload: function(){
		this.game.load.image('player', 'assets/images/ph_char.png');
		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/images/sheet.png');
		this.game.load.image('box', 'assets/images/crate.png');
		this.game.load.spritesheet('simpleShootingEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('simpleMeleeEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('firstBoss', 'assets/images/ph_char.png');
		this.game.load.spritesheet('bullet', 'assets/bullet43.png');
		this.game.load.image('pbullet', 'assets/bullet43.png');
	},

	create: function(){
		//Start the Arcade Physics systems
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		//Change the background colour
		this.game.stage.backgroundColor = "#170e7f";

		//Add the tilemap and tileset image. The first parameter in addTilesetImage
		//is the name you gave the tilesheet when importing it into Tiled, the second
		//is the key to the asset in Phaser
		this.map = this.game.add.tilemap('tilemap');
		this.map.addTilesetImage('factory', 'tiles');

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
		this.hidden = this.map.createLayer('Hidden');

		this.simpleMeleeEnemies = this.game.add.group();
		this.simpleShootingEnemies = this.game.add.group();
		this.firstBoss = this.game.add.group();

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.setAll('immovable',true);
		this.boxes.setAll('body.moves', false);

		simpleMeleeEnemy(this.game, 300, 300, 'simpleMeleeEnemy', this.simpleMeleeEnemies, this.sprite);
	  simpleShootingEnemy(this.game, 400, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, this.sprite);
	  simpleShootingEnemy(this.game, 700, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, this.sprite);
	  simpleShootingEnemy(this.game, 710, 68, 'simpleShootingEnemy', this.simpleShootingEnemies, this.sprite);
		firstBoss(this.game, 13700, 68, 'firstBoss', this.firstBoss, this.sprite);

		this.loseLabel = game.add.text(game.world.centerX, game.world.centerY, "Game Over", {font: '30px Arial', fill: '#ffffff'});
		this.loseLabel.anchor.setTo(0.5, 0.5);
		this.loseLabel.visible = false;

		this.map.createFromObjects('Object Layer 1', 7, 'box', 0, true, false, this.boxes);
		//Change the world size to match the size of this layer
		this.groundLayer.resizeWorld();

		//Set some physics on the sprite
		this.sprite.body.bounce.y = 0.2;
		this.sprite.body.gravity.y = 1000;
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

		for (var i = 0; i < this.firstBoss.children.length; i++) {
			this.firstBoss.children[i].update(this.groundLayer, this.destroyBox, this.bossHitPlayer);
			this.game.physics.arcade.overlap(this.firstBoss.children[i], this.pbullets, this.enemyHit);
		}

		for (var i = 0; i < this.simpleMeleeEnemies.children.length; i++) {
	    this.simpleMeleeEnemies.children[i].update(this.groundLayer, this.destroyBox);
			this.game.physics.arcade.overlap(this.simpleMeleeEnemies.children[i], this.pbullets, this.enemyHit);
	  }

	  for (var i = 0; i < this.simpleShootingEnemies.children.length; i++) {
	    this.simpleShootingEnemies.children[i].update(this.groundLayer, this.destroyBox, this.playerHit);
			this.game.physics.arcade.overlap(this.simpleShootingEnemies.children[i], this.pbullets, this.enemyHit);
	  }
		//Make the sprite collide with the ground layer
		this.game.physics.arcade.collide(this.sprite, this.groundLayer);
		this.game.physics.arcade.collide(this.sprite, this.boxes, this.destroyBox);
		this.map.forEach(function(tile) {tile.collideDown = false}, this, 0, 0, this.map.width, this.map.height, this.groundLayer);
		this.game.physics.arcade.overlap(this.sprite, this.hidden, this.showHidden);

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

		// Falls in pit
		if(this.sprite.y > 1000) {
			this.sprite.kill();
			game.state.start('levelSelect');
		}
	},

	destroyBox: function(sprite, box) {
		box.destroy();
	},

	showHidden: function(player, tile)
	{
		tile.alpha = .75;
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
			game.state.start('levelSelect');
		});
	},

	playerHit: function(player, bullet) {
	  bullet.kill();
		//sprite.kill();
	},

	enemyHit: function(enemy, bullet) {
	  bullet.kill();
		enemy.health-= 10;
		if (enemy.health <= 0) {
			enemy.alive = false;
		}
	},

	bossHitPlayer: function (boss, sprite) {

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
