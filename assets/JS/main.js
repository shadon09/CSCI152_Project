jumpTimer = 0;
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
game.state.start('main');