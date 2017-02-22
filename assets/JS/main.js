
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  this.game.load.spritesheet('player', 'assets/images/dude.png', 32, 48);
	this.game.load.tilemap('tilemap', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('tiles', 'assets/images/Tiles_64x64.png');
	this.game.load.image('box', 'assets/images/tile_06.png');
}

var boxes

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
}

function update() {
	//Make the sprite collide with the ground layer
	this.game.physics.arcade.collide(this.sprite, this.groundLayer);
	this.game.physics.arcade.collide(this.sprite, boxes, destroyBox);
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
}

function destroyBox(sprite, box) {
	box.destroy();
}
/*jumpTimer = 0;
var mainState = {
	preload: function(){
		//Load image assets
		game.load.image('player', '/assets/images/ph_char.png');
		game.load.image('block', '/assets/images/ph_block.png')
	},

	create: function(){
		game.stage.backgroundColor = '#FFFFFF';
		//Start the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//Create the player, enable its physics events, and set its gravity
		this.player = game.add.sprite(game.world.centerX,game.world.centerY,'player');
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 250;

		//Create a sprite group that will contain blocks for the flooring
		this.blocks = game.add.group();
		this.blocks.enableBody = true;
		this.blocks.physicsBodyType = Phaser.Physics.ARCADE;
		this.blocks.createMultiple(30, 'block');
		this.blocks.setAll('anchor.x', 0.5);
		this.blocks.setAll('anchor.y', 1);
		this.blocks.setAll('outOfBoundsKill', true);
		this.blocks.setAll('checkWorldBounds', true);

		this.createBlocks();	
	},

	update: function(){
		this.playerControl();
		//Check for collisions against the player and the blocks
		game.physics.arcade.collide(this.player, this.blocks);
	},

	playerControl: function(){
		//Left and Right keys make the player go left and right
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			this.player.body.velocity.x = -200;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			this.player.body.velocity.x = 200;
		}
		else{
			this.player.body.velocity.x = 0;
		}
		//Spacebar makes the player jump
		//Can only jump when collided with the blocks
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.collide(this.player, this.blocks) && game.time.now > jumpTimer){
			this.player.body.velocity.y = -250;
        	jumpTimer = game.time.now + 750;
		}
	},

	//Creates the flooring
	createBlocks: function(){
		for(var x = 1; x < 31; x++){
			this.block = this.blocks.create(x*32, game.world.height-32, 'block');
			this.block.anchor.setTo(0.5, 0.5);
			this.block.body.immovable = true;
		}
	},
}

var game = new Phaser.Game(800,600);
game.state.add('main', mainState);
game.state.start('main');*/
