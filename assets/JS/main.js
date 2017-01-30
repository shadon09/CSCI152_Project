var mainState = {
	preload: function(){

	},

	create: function(){
		game.stage.backgroundColor = '#000000';
		this.labelSingle = game.add.text(game.world.centerX, game.world.centerY, "Example text", {font:'30px Arial', fill: '#ffffff'});
		this.labelSingle.anchor.setTo(0.5,0.5);
	},

	update: function(){

	},
}

var game = new Phaser.Game(800,600);
game.state.add('main', mainState);
game.state.start('main');