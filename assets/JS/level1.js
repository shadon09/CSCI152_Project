//Put the entire state into a variable
var mainState = {
	preload: function(){
		this.game.load.spritesheet('player', 'assets/robot.png',80,111);
		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/images/sheet.png');
		this.game.load.image('box', 'assets/images/crate.png');
		this.game.load.spritesheet('simpleShootingEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('simpleMeleeEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('firstBoss', 'assets/images/ph_char.png');
		this.game.load.spritesheet('bullet', 'assets/bullet43.png');
		this.game.load.image('pbullet', 'assets/bullet43.png');
		this.game.load.bitmapFont('myFont', 'assets/carrier_command.png', 'assets/carrier_command.xml');
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
		player = createPlayer(this.game, 50, this.game.world.centerY, 'player', 'pbullet');
		player.animations.add('idle', [0, 1, 2, 3,4,5,6,7,8,9], 10, true);
		player.animations.add('move', [10, 11, 12, 13,14,15,16,17], 10, true);
		player.animations.add('jump', [18,19,20,21,22,23,24,25, 26], 10, false);

		graphics = game.add.graphics(10, 10);
		graphics.anchor.set(.5);
		graphics.beginFill(0x000000);
		graphics.drawRect(0, 0, 350, 150);
		graphics.alpha = .7;
		graphics.endFill();

		hpText = this.game.add.bitmapText(graphics.position.x+10, graphics.position.y+25, 'myFont', 'HP:\n'+player.health+'/'+ player.maxHealth, 10);
		xpText = this.game.add.bitmapText(graphics.position.x+10, graphics.position.y+60, 'myFont', 'Xp:', 10);
		var HbarConfig = {width: 250, height: 10, x: graphics.position.x+170, y: graphics.position.y+30, bg: {color: '#8ABA7E'}, bar:{color: '#27B902'}, animationDuration: 200, flipped: false};
		var XPbarConfig = {width: 250, height: 10, x: graphics.position.x+170, y: graphics.position.y+65, bg: {color: '#6DA1E3'}, bar:{color: '#2280F7'}, animationDuration: 200, flipped: false};

		myHealthBar =  new HealthBar(game, HbarConfig);
		myHealthBar.setPercent(player.health);
		myXPbar = new HealthBar(game, XPbarConfig);
		myXPbar.setPercent(player.xp);

		this.hidden = this.map.createLayer('Hidden');

		this.simpleMeleeEnemies = this.game.add.group();
		this.simpleShootingEnemies = this.game.add.group();
		this.firstBoss = this.game.add.group();

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.setAll('immovable',true);
		this.boxes.setAll('body.moves', false);

		simpleMeleeEnemy(this.game, 300, 300, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);
	  simpleShootingEnemy(this.game, 400, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
	  simpleShootingEnemy(this.game, 700, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
	  simpleShootingEnemy(this.game, 710, 68, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
		firstBoss(this.game, 13700, 68, 'firstBoss', this.firstBoss, player);

		this.loseLabel = game.add.text(game.world.centerX, game.world.centerY, "Game Over", {font: '30px Arial', fill: '#ffffff'});
		this.loseLabel.anchor.setTo(0.5, 0.5);
		this.loseLabel.visible = false;

		this.map.createFromObjects('Object Layer 1', 7, 'box', 0, true, false, this.boxes);
		//Change the world size to match the size of this layer
		this.groundLayer.resizeWorld();

		//Make the camera follow the sprite
		this.game.camera.follow(player);

		//Enable cursor keys so we can create some controls
		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	update: function() {
		if(!player.alive){
			this.gameOver();
		}

		if (game.input.activePointer.isDown){
      			player.fire();
  	}
		myHealthBar.setPercent(player.health);
		hpText.text = 'HP:\n'+ player.health+'/'+ player.maxHealth;
		myXPbar.setPercent(player.xp);

		for (var i = 0; i < this.firstBoss.children.length; i++) {
			this.firstBoss.children[i].update(this.groundLayer, this.destroyBox, this.bossHitPlayer);
			this.game.physics.arcade.overlap(this.firstBoss.children[i], player.bullets, this.takeBulletDamage);
		}

		for (var i = 0; i < this.simpleMeleeEnemies.children.length; i++) {
	    this.simpleMeleeEnemies.children[i].update(this.groundLayer, this.destroyBox);
			this.game.physics.arcade.overlap(this.simpleMeleeEnemies.children[i], player.bullets, this.takeBulletDamage);
	  }

	  for (var i = 0; i < this.simpleShootingEnemies.children.length; i++) {
	    this.simpleShootingEnemies.children[i].update(this.groundLayer, this.destroyBox, this.takeBulletDamage);
			this.game.physics.arcade.overlap(this.simpleShootingEnemies.children[i], player.bullets, this.takeBulletDamage);
	  }
		//Make the sprite collide with the ground layer
		this.game.physics.arcade.collide(player, this.groundLayer);
		this.game.physics.arcade.collide(player, this.boxes, this.destroyBox);
		this.map.forEach(function(tile) {tile.collideDown = false}, this, 0, 0, this.map.width, this.map.height, this.groundLayer);
		this.game.physics.arcade.overlap(player, this.hidden, this.showHidden);

		//Make the sprite jump when the up key is pushed
		if(this.cursors.up.isDown && player.body.blocked.down) {
  		player.body.velocity.y = -700;
		}

		if(this.cursors.right.isDown) {
			player.body.velocity.x = 250;
			player.animations.play('move');
			player.scale.x = .6;
		}
		else if(this.cursors.left.isDown) {
			player.body.velocity.x = -250;
			player.animations.play('move');
			player.scale.x = -.6;
		}
		else {
			player.animations.play('idle');
			player.body.velocity.x = 0;
		}

		if(!player.body.blocked.down){
			player.animations.play('jump');
		}

		// Falls in pit
		if(player.y > 1000) {
			player.kill();
			game.state.start('levelSelect');
		}
	},

	destroyBox: function(sprite, box) {
		box.destroy();
	},

	showHidden: function(player, tile) {
		tile.alpha = .75;
	},

	gameOver: function() {
		this.loseLabel.visible = true;
		game.input.onTap.addOnce(function(){
			game.state.start('levelSelect');
		});
	},

	takeBulletDamage: function(object, bullet) {
	  bullet.kill();
		object.damage(bullet.dmg);
		if(!object.alive){
			player.xp+=10;
		}
	},

	takeDamage: function(object, damager) {

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
