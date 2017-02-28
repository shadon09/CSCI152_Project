var boxes;
var mainState = {
preload: function(){
  this.game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
	this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('tiles', 'assets/images/Tiles_64x64.png');
	this.game.load.image('box', 'assets/images/tile_06.png');
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
	this.game.physics.arcade.enable(this.sprite);

	boxes = this.game.add.group();
	boxes.enableBody = true;
	boxes.setAll('immovable',true);
	boxes.setAll('body.moves', false);

	this.map.createFromObjects('Object Layer 1', 7, 'box', 0, true, false, boxes);
	//Change the world size to match the size of this layer
	this.groundLayer.resizeWorld();

	//Set some physics on the sprite
	this.sprite.body.bounce.y = 0.2;
	this.sprite.body.gravity.y = 2000;
	this.sprite.body.gravity.x = 20;
	this.sprite.body.velocity.x = 0;

	//Create a running animation for the sprite and play it
	this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
	this.sprite.animations.play('right');

	//Make the camera follow the sprite
	this.game.camera.follow(this.sprite);

	//Enable cursor keys so we can create some controls
	this.cursors = this.game.input.keyboard.createCursorKeys();
},

update: function() {
	//Make the sprite collide with the ground layer
	this.game.physics.arcade.collide(this.sprite, this.groundLayer);
	this.game.physics.arcade.collide(this.sprite, boxes, this.destroyBox);
	//Make the sprite jump when the up key is pushed
    if(this.cursors.up.isDown && this.sprite.body.blocked.down) {
      this.sprite.body.velocity.y = -1000;
    }

		if(this.cursors.right.isDown) {
			this.sprite.body.velocity.x = 250;
		}
		else if(this.cursors.left.isDown) {
			this.sprite.body.velocity.x = -250;
		}
		else {
			this.sprite.body.velocity.x = 0;
		}
},

destroyBox: function(sprite, box) {
	box.destroy();
},
}


var titleState = {
	preload: function(){
		game.stage.backgroundColor = '#000000';
	},

	create: function(){
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-125, "Platformer", {font: '50px Arial', fill: '#ffffff'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		this.labelTitle = game.add.text(game.world.centerX, game.world.centerY-25, "Play", {font: '30px Arial', fill: '#ffffff'});
		this.labelTitle.anchor.setTo(0.5, 0.5);
		this.labelTitle.inputEnabled = true;
		this.labelTitle.events.onInputDown.add(function(){
			game.state.start('main');
		}, this);
		var spaceKey = game.input.keyboard.addKey(
			Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(function(){
			game.state.start('main');
		}, this);
	},

	update: function(){

	},
}


var game = new Phaser.Game(800,600);
game.state.add('main', mainState);
game.state.add('title', titleState);
game.state.start('title');
