
//Put the entire state into a variable
var mainState = {
	preload: function(){
		this.game.load.spritesheet('player', 'assets/robot.png',80,111);
		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/images/sheet.png');
		this.game.load.image('box', 'assets/images/crate.png');
		this.game.load.spritesheet('simpleShootingEnemy', 'assets/C18.png');
		this.game.load.spritesheet('simpleMeleeEnemy', 'assets/robot.png', 80, 111);
		this.game.load.spritesheet('firstBoss', 'assets/robot.png', 80, 111);
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
		graphics.fixedToCamera = true;
		graphics.beginFill(0x000000);
		graphics.drawRect(0, 0, 350, 150);
		graphics.alpha = .7;
		graphics.endFill();
		graphics.visible = false;

		hpText = this.game.add.bitmapText(graphics.position.x+10, graphics.position.y+25, 'myFont', 'HP:\n'+player.health+'/'+ player.maxHealth, 10);
		hpText.fixedToCamera = true;
		//xpText = this.game.add.bitmapText(graphics.position.x+10, graphics.position.y+60, 'myFont', 'Xp:', 10);
		var HbarConfig = {width: 250, height: 10, x: graphics.position.x+170, y: graphics.position.y+30, bg: {color: '#8ABA7E'}, bar:{color: '#27B902'}, animationDuration: 200, flipped: false, isFixedToCamera: true,};
		//var XPbarConfig = {width: 250, height: 10, x: graphics.position.x+170, y: graphics.position.y+65, bg: {color: '#6DA1E3'}, bar:{color: '#2280F7'}, animationDuration: 200, flipped: false};

		myHealthBar =  new HealthBar(game, HbarConfig);
		myHealthBar.setPercent(player.health);
		//myXPbar = new HealthBar(game, XPbarConfig);
		//myXPbar.setPercent(player.xp);

		this.hidden = this.map.createLayer('Hidden');

		this.simpleMeleeEnemies = this.game.add.group();
		this.simpleShootingEnemies = this.game.add.group();
		this.firstBoss = this.game.add.group();

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.setAll('immovable',true);
		this.boxes.setAll('body.moves', false);

		simpleMeleeEnemy(this.game, 300, 300, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);
		simpleMeleeEnemy(this.game, 500, 300, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);
		simpleMeleeEnemy(this.game, 1400, 60, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);
		simpleMeleeEnemy(this.game, 1500, 60, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);
		simpleMeleeEnemy(this.game, 1800, 300, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);
		simpleMeleeEnemy(this.game, 2700, 60, 'simpleMeleeEnemy', this.simpleMeleeEnemies, player);



	  simpleShootingEnemy(this.game, 400, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
	  simpleShootingEnemy(this.game, 700, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
	  simpleShootingEnemy(this.game, 710, 68, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
		simpleShootingEnemy(this.game, 1200, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
		simpleShootingEnemy(this.game, 1500, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);
		simpleShootingEnemy(this.game, 2800, 300, 'simpleShootingEnemy', this.simpleShootingEnemies, player);


		firstBoss(this.game, 13700, 68, 'firstBoss', this.firstBoss, player);

		this.loseLabel = game.add.text(game.world.centerX, game.world.centerY, "Game Over", {font: '30px Arial', fill: '#ffffff'});
		this.loseLabel.anchor.setTo(0.5, 0.5);
		this.loseLabel.visible = false;
		this.loseLabel.fixedToCamera = true;

		this.map.createFromObjects('Object Layer 1', 7, 'box', 0, true, false, this.boxes);
		//Change the world size to match the size of this layer
		this.groundLayer.resizeWorld();

		//Make the camera follow the sprite
		this.game.camera.follow(player);

		//Enable cursor keys so we can create some controls
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.wasd = {
  		up: game.input.keyboard.addKey(Phaser.Keyboard.W),
  		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
  		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			boss: game.input.keyboard.addKey(Phaser.Keyboard.B)
		};

	},

	update: function() {
		if(!player.alive){
			this.gameOver();
		}

		if (game.input.activePointer.isDown){
      			player.fire();
						console.log(game.world.x);
						console.log(game.world.y);
						console.log("---------------");
  	}
		myHealthBar.setPercent(player.health);
		hpText.text = 'HP:\n'+ player.health+'/'+ player.maxHealth;
		//myXPbar.setPercent(player.xp);

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
		//this.map.forEach(function(tile) {tile.collideDown = false}, this, 0, 0, this.map.width, this.map.height, this.groundLayer);
		this.game.physics.arcade.overlap(player, this.hidden, this.showHidden);

		//Make the sprite jump when the up key is pushed
		if(this.wasd.up.isDown && player.body.blocked.down) {
  		player.body.velocity.y = -700;
		}

		if(this.wasd.right.isDown) {
			player.body.velocity.x = 250;
			player.animations.play('move');
			player.scale.x = .6;
		}
		else if(this.wasd.left.isDown) {
			player.body.velocity.x = -250;
			player.animations.play('move');
			player.scale.x = -.6;
		}
		else {
			player.animations.play('idle');
			player.body.velocity.x = 0;
		}


		if(this.wasd.boss.isDown) {
			player.x= 13000;
			player.y= this.game.world.centerY;
		}

		if(!player.body.blocked.down){
			player.animations.play('jump');
		}

		// Falls in pit
		if(player.y > 1000) {
			this.gameOver();
		}
	},

	destroyBox: function(sprite, box) {
		box.destroy();
	},

	showHidden: function(player, tile)
	{
		tile.alpha = .75;
	},

	gameOver: function(){
		player.kill();
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

	bossHitPlayer: function(boss, player) {
		player.damage(1);
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
			game.state.start('levelSelect');
		}, this);
		//If spacebar is pushed, start mainState
		var spaceKey = game.input.keyboard.addKey(
			Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(function(){
			game.state.start('levelSelect');
		}, this);
	},

	update: function(){

	},
}

var levMenuState = {
	preload: function(){
			this.game.load.spritesheet('button', 'assets/images/number-buttons-90x90.png', 90, 90);
		//Set the background Color
		game.stage.backgroundColor = '#ffffff';

	},

	create: function(){
		game.camera.focusOnXY(game.world.centerX, game.world.centerY);
		//Add text with value set to "Platformer"
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-200, "Level Select", {font: '50px Arial', fill: '#000000'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Add text with value set to "Play"
		this.labelNext = game.add.text(game.world.centerX, game.world.centerY, "Next Level", {font: '30px Arial', fill: '#000000'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Allow for the "Play" text to be clicked on
		this.labelTitle.inputEnabled = true;
		 this.button = game.add.button(game.world.centerX - 195, game.world.centerY - 50, 'button', function() {game.state.start('main')}, this, 0, 0, 0);
		 this.button.anchor.setTo(0.5, 0.5);
		 this.button2 = game.add.button(game.world.centerX - 95, game.world.centerY - 50, 'button', function() {game.state.start('level2')}, this, 1, 1, 1);
		 this.button2.anchor.setTo(0.5, 0.5);

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
game = new Phaser.Game(800,600);
//Add the mainState
game.state.add('main', mainState);
//Add the titleState
game.state.add('title', titleState);
//Add the Level select state
//game.state.add('level2', level2);
game.state.add('levelSelect', levMenuState);
game.state.start('title', titleState);
/*var fireRate = 300;
var nextFire = 0;
var playerHealth = 100;
var healthPack;
var myHealthBar;
var playerLives = 5;
var playerXP = 0;
var gameXPsteps = 15;
var playerLevel = 0;

function simpleMeleeEnemy(game, x, y, key, group, player){
	var obj = game.add.sprite(x, y, key, 0, group);
	obj.health = 100;
	game.physics.arcade.enable(obj);
	obj.body.collideWorldBounds = true;
  var EnemybarConfig = {width: 30, height: 5, x: obj.position.x, y: obj.position.y+25, bg: {color: '#000000'}, bar:{color: '#FF0000'}, animationDuration: 200, flipped: false};
  var enemyHealthBar = new HealthBar(game, EnemybarConfig);
	enemyHealthBar.setPercent(obj.health);

	obj.body.bounce.y = 0.2;
	obj.body.gravity.y = 1000;
	obj.body.gravity.x = 0;
	obj.body.velocity.x = 0;
	obj.anchor.setTo(.5, .5);

	obj.jump = function() {
		if (obj.body.blocked.down) {
			obj.body.velocity.y = -700;
		}
	}

	obj.pursue = function(layer) {
		if(player.alive){
			var collideLeftDown = layer.getTiles(obj.x-30, obj.y+60, 32, game.height, true);
			var collideLeft = layer.getTiles(obj.x-30, obj.y-32, 32, 48, true);
			var collideRightDown = layer.getTiles(obj.x+30, obj.y+60, 32, game.height, true);
			var collideRight =layer.getTiles(obj.x+30, obj.y-32, 32, 48, true);

			var xDistance = player.x - obj.x;
			var yDistance = player.y - obj.y;

			// when player is to the left of enemy, and within a certain distance
			if (xDistance < -25 && xDistance > -300) {

				// if there is a cliff to the left and the player is too far away in the x direction then the enemy won't try and chase
				if ((collideLeftDown.length == 0) && (Math.abs(xDistance) > 70) && (obj.body.blocked.down)){
				  obj.body.velocity.x = 0;
				}
				else {
					// if the enemy is pursuing and there is an obstacle to the left it will attempt to jump over it
					if (collideLeft.length != 0) {
						obj.jump();
					}
					// if the player isn't too far away in the y direction and there isn't a cliff to the left of the enemy
					if (!((collideLeftDown.length == 0) &&  (yDistance < -200))) {
				  	obj.body.velocity.x = -250;
						obj.scale.setTo(-1, 1);
					}
					// the enemy will stop to avoid falling off cliff
					else {
						obj.body.velocity.x = 0
					}
				}
			}
			// when player is to the right of enemy, and within a certain distance
			if (xDistance > 25 && xDistance < 300) {

				// if there is a cliff to the right and the player is too far away in the x direction then the enemy won't try and chase
				if ((collideRightDown.length == 0) && (Math.abs(xDistance) > 70) && (obj.body.blocked.down)){
				  obj.body.velocity.x = 0;
				}
				else {
					// if the enemy is pursuing and there is an obstacle to the right it will attempt to jump over it
					if (collideRight.length != 0) {
						obj.jump();
					}

					// if the player isn't too far away in the y direction and there isn't a cliff to the right of the enemy
					if (!((collideRightDown.length == 0) &&  (yDistance < -200))) {
				  	obj.body.velocity.x = 250;
						obj.scale.setTo(1, 1);
					}
					// the enemy will stop to avoid falling off cliff
					else {
						obj.body.velocity.x = 0
					}
				}
			}
			// when the enemy gets close enough to player it will stop moving, this would be a good spot to have them attack player
			if ((xDistance < 15) && (xDistance > -15)){
				obj.body.velocity.x = 0;
			}

			// if the player is above enemy and close enough in x and y directions then the enemy will jump
			if ((player.y < (obj.y-25)) && (Math.abs(xDistance) < 90) && (Math.abs(yDistance) < 300)){
				obj.jump();
			}
		}
		else{
			obj.body.velocity.x = 0;
		}
	};

	obj.update = function(layer, boxesCollisionHandler) {
		if(obj.alive){
			try {
				game.physics.arcade.collide(obj, layer);
				game.physics.arcade.collide(obj, game.boxes, boxesCollisionHandler);

				obj.pursue(layer);

	      enemyHealthBar.setPosition(obj.position.x, obj.position.y-25);
	    	enemyHealthBar.setPercent(obj.health);
	      obj.visible = true;
			} catch (e) {
				return;
			}
		}
		else {
			enemyHealthBar.kill();
			obj.destroy();
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
	obj.health = 100;
	game.physics.arcade.enable(obj);
	obj.body.collideWorldBounds = true;
  var EnemybarConfig = {width: 30, height: 5, x: obj.position.x, y: obj.position.y+25, bg: {color: '#000000'}, bar:{color: '#FF0000'}, animationDuration: 200, flipped: false};
  var enemyHealthBar = new HealthBar(game, EnemybarConfig);
	enemyHealthBar.setPercent(obj.health);

	obj.body.bounce.y = 0.2;
	obj.body.gravity.y = 1000;
	obj.body.gravity.x = 0;
	obj.body.velocity.x = 0;
	obj.anchor.setTo(.5, .5);

	obj.fire = function() {
		if(player.alive){
			var xDistance = Math.abs(player.x - obj.x);
			var yDistance = Math.abs(player.y - obj.y);

			if (game.time.now > nextFire && xDistance < 500 && yDistance < 500)
			{
					nextFire = game.time.now + fireRate;
					bullet = game.add.sprite(obj.x, obj.y, 'bullet', 0, bullets);
					bullet.dmg = 10;
					game.physics.arcade.moveToXY(bullet, player.x, player.y-15, 300);
			}
		}
	};

	obj.update = function(layer, boxesCollisionHandler, playerCollisionHandler) {
		if(obj.alive){
			try {
				game.physics.arcade.collide(obj, layer);
		  	game.physics.arcade.collide(obj, game.boxes, boxesCollisionHandler);
		    obj.fire();
		    game.physics.arcade.overlap(player, bullets, playerCollisionHandler);
	      enemyHealthBar.setPosition(obj.position.x, obj.position.y-25);
	    	enemyHealthBar.setPercent(obj.health);
	      obj.visible = true;
			} catch (e) {
				return;
			}
		}
		else {
			enemyHealthBar.kill();
			obj.destroy();
		}
	};

	return obj;
}

function firstBoss(game, x, y, key, group, player){
	var attackRate = 1000;
	var nextAttack = 0;
	var dropAttackNum = 0;
	var chargeAttacks = 0;
	var obj = game.add.sprite(x, y, key, 0, group);
	obj.health = 100;
	game.physics.arcade.enable(obj);
	obj.body.collideWorldBounds = true;
  var EnemybarConfig = {width: 30, height: 5, x: obj.position.x, y: obj.position.y+25, bg: {color: '#000000'}, bar:{color: '#FF0000'}, animationDuration: 200, flipped: false};
  var enemyHealthBar = new HealthBar(game, EnemybarConfig);
	enemyHealthBar.setPercent(obj.health);

	obj.body.bounce.y = 0.2;
	obj.body.gravity.y = 1000;
	obj.body.gravity.x = 0;
	obj.body.velocity.x = 0;
	obj.anchor.setTo(.5, .5);

	obj.chargeAttack = function(){
		game.physics.arcade.moveToXY(obj, player.x, player.y-15, 800);
	}

	obj.dropAttack = function (){
		obj.x = player.x;
		obj.y = player.y - 200;
		obj.body.velocity.x = 0;
		game.physics.arcade.moveToXY(obj, player.x, player.y-15, 400);
	}

	obj.fight = function (){
		var tripletAttackRate = 700;
		var attackDistance = 700;
		var xDistance = Math.abs(player.x - obj.x);
		var yDistance = Math.abs(player.y - obj.y);

		if(xDistance < attackDistance && yDistance < attackDistance) {
			if (game.time.now > nextAttack && (dropAttackNum%4 == 0))
			{
					nextAttack = game.time.now + attackRate;
					dropAttackNum++;
					obj.chargeAttack();
			}
			else if (game.time.now > nextAttack && obj.body.blocked.down) {
				nextAttack = game.time.now + tripletAttackRate;
				obj.dropAttack();
				dropAttackNum++;
			}
		}
	};

	obj.update = function(layer, boxesCollisionHandler, playerCollisionHandler) {
		if(obj.alive){
			try {
				game.physics.arcade.collide(obj, layer);
				game.physics.arcade.collide(obj, game.boxes, boxesCollisionHandler);
				game.physics.arcade.overlap(obj, player, playerCollisionHandler);
				obj.fight();
	      enemyHealthBar.setPosition(obj.position.x, obj.position.y-25);
	    	enemyHealthBar.setPercent(obj.health);
	      obj.visible = true;
			} catch (e) {
				return;
			}
		}
		else {
			enemyHealthBar.kill();
			obj.destroy();
		}
	};

	return obj;
}

//Put the entire state into a variable
var mainState = {
	preload: function(){
  		this.game.load.image('player', 'assets/images/ph_char.png');
		this.game.load.spritesheet('robot', 'assets/robot.png', 80, 111);

		this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/images/sheet.png');
		this.game.load.image('box', 'assets/images/tile_06.png');
		this.game.load.spritesheet('simpleShootingEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('simpleMeleeEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('bullet', 'assets/images/ph_char.png', 10, 5);
		this.game.load.image('pbullet', 'assets/bullet43.png');
		this.game.load.image('healthP', 'assets/firstaid.png');
		this.game.load.bitmapFont('myFont', 'assets/carrier_command.png', 'assets/carrier_command.xml');
		this.game.load.spritesheet('firstBoss', 'assets/images/ph_char.png');
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
		this.map.addTilesetImage('factory', 'tiles');

		//Add both the background and ground layers. We won't be doing anything with the
		//GroundLayer though
		this.backgroundlayer = this.map.createLayer('Background');
		this.groundLayer = this.map.createLayer('Ground');

		//Before you can use the collide function you need to set what tiles can collide
		this.map.setCollisionBetween(1, 100, true, 'Ground');

		//Add the sprite to the game and enable arcade physics on it
		this.sprite = this.game.add.sprite(10, this.game.world.centerY, 'robot');
		this.sprite.scale.setTo(0.5,0.5);
		this.sprite.anchor.setTo(.5, 1);
		this.game.physics.arcade.enable(this.sprite);
		this.sprite.animations.add('idle', [0, 1, 2, 3,4,5,6,7,8,9], 10, true);
		this.sprite.animations.add('move', [10, 11, 12, 13,14,15,16,17], 10, true);
		this.sprite.animations.add('jump', [18,19,20,21,22,23,24,25, 26], 10, true);


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

		this.firstBoss = this.game.add.group();
		firstBoss(this.game, 13700, 68, 'firstBoss', this.firstBoss, this.sprite);

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

		this.graphics = game.add.graphics(10, 10);
		this.graphics.anchor.set(0.5);
		this.graphics.beginFill(0x000000);
		this.graphics.drawRect(0,0,350,150);
		this.graphics.alpha = 7;
		this.graphics.endFill();
		this.graphics.fixedToCamera = true;
		this.graphics.visible = false;

		this.hpText = game.add.bitmapText(this.graphics.position.x+10, this.graphics.position.y+25, 'myFont', 'HP:\n'+playerHealth+'/'+ this.sprite.maxHealth, 10);
		this.hpText.fixedToCamera = true;
		this.HbarConfig = {width: 250, height: 10, x: this.graphics.position.x+170, y: this.graphics.position.y+30, bg: {color: '#8ABA7E'}, bar:{color: '#27B902'}, animationDuration: 200, flipped: false, fixedToCamera: true,};
		this.myHealthBar =  new HealthBar(this.game, this.HbarConfig);
		this.myHealthBar.setPercent(playerHealth);

	},

	update: function() {

		this.myHealthBar.setPercent(playerHealth);
		this.hpText.text = 'HP:\n'+ this.sprite.health+'/'+ this.sprite.maxHealth;
		if (game.input.activePointer.isDown){
      			this.fire();
  		}
		for (var i = 0; i < this.firstBoss.children.length; i++) {
			this.firstBoss.children[i].update(this.groundLayer, this.destroyBox, this.bossHitPlayer);
			this.game.physics.arcade.overlap(this.firstBoss.children[i], player.bullets, this.enemyHit);
		}

		for (var i = 0; i < this.simpleMeleeEnemies.children.length; i++) {
	    this.simpleMeleeEnemies.children[i].update(this.groundLayer, this.destroyBox);
			this.game.physics.arcade.overlap(this.simpleMeleeEnemies.children[i], player.bullets, this.enemyHit);
	  }

	  for (var i = 0; i < this.simpleShootingEnemies.children.length; i++) {
	    this.simpleShootingEnemies.children[i].update(this.groundLayer, this.destroyBox, this.playerHit);
			this.game.physics.arcade.overlap(this.simpleShootingEnemies.children[i], player.bullets, this.enemyHit);
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
	    		//this.game.physics.arcade.collide(this.sprite, this.simpleShootingEnemies.children[i].getBullets(), this.hitPlayer);
	  	}

		for (var i = 0; i < this.firstBoss.children.length; i++) {
			this.firstBoss.children[i].update(this, this.destroyBox, this.bossHitPlayer);
		}
		this.game.physics.arcade.collide(this.sprite, this.groundLayer);
		this.game.physics.arcade.collide(this.sprite, this.boxes, this.destroyBox);
		//for (var i = 0; i < this.simpleMeleeEnemies.children.length; i++){
			this.game.physics.arcade.collide(this.pbullets, this.simpleMeleeEnemies, this.hitEnemy);
		//}

		//for (var i = 0; i < this.simpleShootingEnemies.children.length; i++){
			this.game.physics.arcade.collide(this.pbullets, this.simpleShootingEnemies, this.hitEnemy);
		//}
		//Make the sprite jump when the up key is pushed
    		if(this.cursors.up.isDown && this.sprite.body.blocked.down) {
      			this.sprite.body.velocity.y = -1000;
			this.sprite.animations.play('jump');
    		}

		if(this.cursors.right.isDown) {
			this.sprite.body.velocity.x = 250;
			this.sprite.scale.setTo(0.5, 0.5);
			this.sprite.animations.play('move');
		}
		else if(this.cursors.left.isDown) {
			this.sprite.body.velocity.x = -250;
			this.sprite.scale.setTo(-0.5, 0.5);
			this.sprite.animations.play('move');
		}
		else {
			this.sprite.body.velocity.x = 0;
			this.sprite.animations.play('idle');
		}

		if(this.sprite.y > 1000) {
			this.sprite.kill();
			game.state.start('title');
		}
	},

	destroyBox: function(sprite, box) {
		box.destroy();
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
	},

	hitPlayer: function(sprite, bullet) {
	  	bullet.destroy();
		sprite.kill();
		//game.input.onTap.addOnce(function(){
		//	game.state.start('title');
		//})
	},

	hitEnemy: function(bullet, enemy){
		bullet.destroy();
		enemy.destroy();
	},

	bossHitPlayer: function (sprite, boss) {
		sprite.body.velocity.x = boss.body.velocity.x;
		sprite.body.velocity.y = -300;
	}
}



var titleState = {
	preload: function(){
		//Set the background Color
		game.stage.backgroundColor = '#000000';
	},

	create: function(){

		game.camera.focusOnXY(game.world.centerX, game.world.centerY);
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


var levMenuState = {
	preload: function(){
			this.game.load.spritesheet('button', 'assets/images/number-buttons-90x90.png', 90, 90);
		//Set the background Color
		game.stage.backgroundColor = '#ffffff';

	},

	create: function(){
		game.camera.focusOnXY(game.world.centerX, game.world.centerY);
		//Add text with value set to "Platformer"
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-200, "Level Select", {font: '50px Arial', fill: '#000000'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Add text with value set to "Play"
		this.labelNext = game.add.text(game.world.centerX, game.world.centerY, "Next Level", {font: '30px Arial', fill: '#000000'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Allow for the "Play" text to be clicked on
		this.labelTitle.inputEnabled = true;
		 this.button = game.add.button(game.world.centerX - 195, game.world.centerY - 50, 'button', function() {game.state.start('main')}, this, 0, 0, 0);
		 this.button.anchor.setTo(0.5, 0.5);
		 this.button2 = game.add.button(game.world.centerX - 95, game.world.centerY - 50, 'button', function() {game.state.start('level2')}, this, 1, 1, 1);
		 this.button2.anchor.setTo(0.5, 0.5);

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
game = new Phaser.Game(800,600);
//Add the mainState
game.state.add('main', mainState);
//Add the titleState
game.state.add('title', titleState);

game.state.add('levelSelect', levMenuState);
//Start the game with the titleState
game.state.start('title');
/*=======

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
		this.game.load.image('tiles', 'assets/images/sheet.png');
		this.game.load.image('box', 'assets/images/crate.png');
		this.game.load.spritesheet('simpleShootingEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('simpleMeleeEnemy', 'assets/images/ph_char.png');
		this.game.load.spritesheet('bullet', 'assets/images/ph_char.png', 10, 5);
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

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.setAll('immovable',true);
		this.boxes.setAll('body.moves', false);

		this.hidden = this.map.createLayer('Hidden');

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
		this.map.forEach(function(tile) {tile.collideDown = false}, this, 0, 0, this.map.width, this.map.height, this.groundLayer);
		this.game.physics.arcade.overlap(this.sprite, this.hidden, this.showHidden);
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

	hitPlayer: function(sprite, bullet) {
	  	bullet.destroy();
		//sprite.kill();
		/*game.input.onTap.addOnce(function(){
			game.state.start('title');
		})
	}
}

var level2 = {
	preload: function() {
	  this.game.load.spritesheet('player', 'assets/dude.png', 32, 48);
		this.game.load.tilemap('tilemap', 'assets/level2.json', null, Phaser.Tilemap.TILED_JSON);
	  this.game.load.image('tiles', 'assets/snow.png');
		this.game.load.image('spike', 'assets/spikeTop.png');
		this.game.load.image('platform', 'assets/tundraHalfMid.png');
	},

	create: function() {
		//Start the Arcade Physics systems
		game.physics.startSystem(Phaser.Physics.ARCADE);


		//Add the tilemap and tileset image. The first parameter in addTilesetImage
		//is the name you gave the tilesheet when importing it into Tiled, the second
		//is the key to the asset in Phaser
		this.map = game.add.tilemap('tilemap');
		this.map.addTilesetImage('Snow', 'tiles');

		//Add both the background and ground layers. We won't be doing anything with the
		//GroundLayer though
		this.background = this.map.createLayer('Background');
		this.ground = this.map.createLayer('Ground');

		//Before you can use the collide function you need to set what tiles can collide
		this.map.setCollisionBetween(1, 100, true, 'Ground');

		this.platforms = this.game.add.group();
		this.platforms.enableBody = true;
		this.map.createFromObjects('Falling Platforms', 13, 'platform', 0, true, false, this.platforms);

		this.platforms.forEach(function(p) {
			this.physics.enable(p, Phaser.Physics.ARCADE);
			p.body.allowGravity = false;
      p.body.immovable = true;
		}, this);

		//Add the sprite to the game and enable arcade physics on it
		this.character = game.add.sprite(50, game.world.centerY - 150, 'player');
		game.physics.arcade.enable(this.character);
		this.hidden = this.map.createLayer('Hidden');

		this.spikes = game.add.group();
		this.spikes.enableBody = true;
		this.map.createFromObjects('Hazard', 60, 'spike', 0, true, false, this.spikes);
		this.game.physics.arcade.enable(this.spikes);

		//Change the world size to match the size of this layer
		this.ground.resizeWorld();
		this.map.forEach(function(tile) {tile.collideDown = false}, this, 0, 0, this.map.width, this.map.height, this.ground);

		//Set some physics on the sprite
		this.character.body.bounce.y = 0.2;
		this.character.body.gravity.y = 1200;
		this.character.body.gravity.x = 20;
		this.character.body.velocity.x = 0;

		//Create a running animation for the sprite and play it
		this.character.animations.add('right', [5, 6, 7, 8], 10, true);
		this.character.animations.play('right');

		//Make the camera follow the sprite
		this.game.camera.follow(this.character);
		//Enable cursor keys so we can create some controls
		this.cursors = game.input.keyboard.createCursorKeys();
	},

	update: function() {
		//Make the sprite collide with the ground layer
		this.game.physics.arcade.collide(this.character, this.ground);
		this.game.physics.arcade.collide(this.character, this.platforms, this.platFallDelay, null, this);
		this.game.physics.arcade.overlap(this.character, this.hidden, this.showHidden);
		//game.physics.arcade.collide(character, boxes, destroyBox);
	  this.spikes.forEach(this.spikeFall, this, true);

		//Make the sprite jump when the up key is pushed
	    if(this.cursors.up.isDown && (this.character.body.onFloor())) {
	      this.character.body.velocity.y = -800;
	    }

			if(this.cursors.right.isDown) {
				this.character.body.velocity.x = 250;
			}
			else if(this.cursors.left.isDown && (this.character.x > 5820 || this.character.x < 5790)) {
				this.character.body.velocity.x = -250;
			}
			else {
				this.character.body.velocity.x = 0;
			}


			// Falls in pit
			if(this.character.y > 1000) {
				this.character.kill();
				game.state.start('levelSelect');

			}
	},

	destroyBox: function(sprite, box) {
		box.destroy();
	},

	spikeFall: function(trap) {
		if (this.character.x >= trap.x)
			trap.body.gravity.y = 5000;
	},

	platFallDelay: function(player, plat) {
		this.game.time.events.add(Phaser.Timer.SECOND, this.platFall, this, plat);
	},

	platFall: function(plat) {
		var t = this.game.add.tween(plat);
    var dist = ((this.game.world.height + 100) - plat.y);
    var time = dist * 2.25;
    t.to( { y: plat.y + dist }, time, Phaser.Easing.Quadratic.In, false, 0, 0, false);
		t.start();
		plat.y = plat.y+100;

	},

	showHidden: function(player, tile)
	{
		tile.alpha = .75;
	},

	render: function() {
		var zone = this.game.camera.deadzone;

	    this.game.debug.cameraInfo(this.game.camera, 64, 64);
	    this.game.debug.spriteCoords(this.character, 64, 320);
			this.game.debug.text("Time until event: " + game.time.events.duration, 128, 32);
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

var levMenuState = {
	preload: function(){
			this.game.load.spritesheet('button', 'assets/images/number-buttons-90x90.png', 90, 90);
		//Set the background Color
		game.stage.backgroundColor = '#ffffff';

	},

	create: function(){
		game.camera.focusOnXY(game.world.centerX, game.world.centerY);
		//Add text with value set to "Platformer"
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-200, "Level Select", {font: '50px Arial', fill: '#000000'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Add text with value set to "Play"
		this.labelNext = game.add.text(game.world.centerX, game.world.centerY, "Next Level", {font: '30px Arial', fill: '#000000'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		//Allow for the "Play" text to be clicked on
		this.labelTitle.inputEnabled = true;
		 this.button = game.add.button(game.world.centerX - 195, game.world.centerY - 50, 'button', function() {game.state.start('main')}, this, 0, 0, 0);
		 this.button.anchor.setTo(0.5, 0.5);
		 this.button2 = game.add.button(game.world.centerX - 95, game.world.centerY - 50, 'button', function() {game.state.start('level2')}, this, 1, 1, 1);
		 this.button2.anchor.setTo(0.5, 0.5);

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
game = new Phaser.Game(800,600);
//Add the mainState
game.state.add('main', mainState);
//Add the titleState
game.state.add('title', titleState);
//Add the Level select state
game.state.add('level2', level2);
game.state.add('levelSelect', levMenuState);

//Start the game with the titleState
game.state.start('title');
>>>>>>> 832dfd7e11b6dff04eba504fa6d37dd950545609*/
