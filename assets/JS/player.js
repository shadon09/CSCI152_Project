






var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//http://localhost:8080




var healthPack;
var myHealthBar;
var playerLives = 5;
var playerXP = 10;
var lvl = 0;


function preload() {
	
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
	game.load.spritesheet('robot', 'assets/test5.png', 567, 556);
	game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
	game.load.image('bullet', 'assets/bullet23.png');
	game.load.image('flame', 'assets/flame2.png');
	game.load.image('healthP', 'assets/firstaid.png');
	game.load.bitmapFont('myFont', 'assets/carrier_command.png', 'assets/carrier_command.xml');

}



function create() {
	
///////////////ENV//////////////////////////////////////////////////////////
	game.physics.startSystem(Phaser.Physics.ARCADE); 
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
	
	
	reload =  game.input.keyboard.addKey(Phaser.Keyboard.R);
	jumpButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
	cursors = game.input.keyboard.createCursorKeys();
	shootButton = game.input.activePointer;

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
	
	
///////////////////////////////////////////////////////////////////////	


	
    player = game.add.sprite(32, game.world.height - 150, 'robot');
	player.anchor.set(0.5);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0;
    player.body.collideWorldBounds = true;
	player.frame = 1;
	player.animations.add('idle', [0, 1, 2, 3,4,5,6,7,8,9], 10, true);
	player.animations.add('jump', [10,11,12,13,14,15,16,17], 10, false);
	player.animations.add('move', [25, 26,27,28], 10, true);
	player.animations.add('runshoot', [32, 33,34,35, 36,37,38], 10,true);

	player.scale.set(.2,.2);
	player.body.gravity.y = 1400;
	player.speed =100;
	player.body.allowRotation= false;
	player.setHealth(50);


	
	enemy1 = game.add.sprite(500, game.world.height-150,'baddie');
	enemy1.enableBody = true;
	enemy1.anchor.set(0.5);
	enemy1.setHealth(enemy1.maxHealth);
    game.physics.arcade.enable(enemy1);
    enemy1.body.bounce.y = 0.2;
    enemy1.body.collideWorldBounds = true;
    enemy1.animations.add('left', [0, 1], 10, true);
    enemy1.animations.add('right', [2,3], 10, true);
	enemy1.body.gravity.y = 1400;
	enemy1.body.allowRotation= false;
	
 	enemy2 = game.add.sprite(550, game.world.height-150,'baddie');
	enemy2.enableBody = true;
	enemy2.anchor.set(0.5);
	enemy2.setHealth(enemy1.maxHealth);
    game.physics.arcade.enable(enemy2);
    enemy2.body.bounce.y = 0.2;
    enemy2.body.collideWorldBounds = true;
    enemy2.animations.add('left', [0, 1], 10, true);
    enemy2.animations.add('right', [2,3], 10, true);
	enemy2.body.gravity.y = 1400;
	enemy2.body.allowRotation= false;
	
	 
	
	enemies= game.add.group();
	enemies.add(enemy1);
	enemies.add(enemy2);

	graphics = game.add.graphics(10, 10);
	graphics.anchor.set(.5);
	graphics.beginFill(0x000000);
	graphics.drawRect(0, 0, 350, 150);
	graphics.alpha = .7;
	graphics.fixedToCamera =true;
	graphics.endFill();
	
	
	
	
	var HbarConfig = {width: 250, height: 10, x: graphics.position.x+170, y: graphics.position.y+30, bg: {color: '#8ABA7E'}, bar:{color: '#27B902'}, animationDuration: 200, flipped: false};
	var XPbarConfig = {width: 250, height: 10, x: graphics.position.x+170, y: graphics.position.y+65, bg: {color: '#6DA1E3'}, bar:{color: '#2280F7'}, animationDuration: 200, flipped: false};
	var EnemybarConfig = {width: 30, height: 5, x: enemy1.position.x, y: enemy1.position.y+25, bg: {color: '#EE4141'}, bar:{color: '#FF0000'}, animationDuration: 200, flipped: false};
	myXPbar = new HealthBar(game, XPbarConfig);
	myXPbar.setPercent(playerXP);
	myHealthBar =  new HealthBar(game, HbarConfig);
	myHealthBar.setPercent(player.health);
	
	enemy1HealthBar = new HealthBar(game, EnemybarConfig);
	enemy1HealthBar.setPercent(enemy1.health);
	

	healthPack  = game.add.sprite(350,100, 'healthP');
    game.physics.arcade.enable(healthPack);
	healthPack.body.collideWorldBounds =false;
	healthPack.body.gravity.y = 1400;
	healthPack.body.bounce.y = .2;
	healthPack.anchor.set(.5);
	
	
	var myPoint = new Phaser.Point(-100,-100);
	weapon = game.add.weapon(30, 'bullet');
	weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	weapon.bulletSpeed = 2500;
	weapon.fireRate=200;
	weapon.trackSprite(player, 0,0,false);
	weapon.fireLimit = 30;
	
	
	textGroup= game.add.group();
	livesText = game.add.bitmapText(graphics.position.x+10,graphics.position.y+85 , 'myFont', "lives: " + playerLives, 10);
	lvlText = game.add.bitmapText(graphics.position.x+150,graphics.position.y+85 , 'myFont', "Level: " + lvl, 10);
	weaponInfoText =  game.add.bitmapText(graphics.position.x+10, graphics.position.y+110, 'myFont', "Ammo: " + (weapon.fireLimit -  weapon.shots) + '/'+ weapon.fireLimit, 10);
	hpText = game.add.bitmapText(graphics.position.x+10, graphics.position.y+25, 'myFont', 'HP:\n'+player.health+'/'+ player.maxHealth, 10);
	xpText = game.add.bitmapText(graphics.position.x+10, graphics.position.y+60, 'myFont', 'Xp:', 10);
	textGroup.add(livesText);
	

	

	
	}

function update() {


	graphics.x = 10;
	graphics.y = 10;
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(enemy1, platforms);
	game.physics.arcade.collide(enemy2, platforms);
	game.physics.arcade.overlap(weapon.bullets, platforms, bulletPlatformCollision)
	game.physics.arcade.overlap(weapon.bullets, enemies, bulletEnemyCollision);
	game.physics.arcade.collide(healthPack, platforms);
	game.physics.arcade.overlap(player, healthPack, healthPackCollision, null, this);

	if(game.physics.arcade.overlap(player, enemies)== true)
	{
		player.visible =  false;
		player.right = player.position.x-5;
		player.damage(10);
		if(player.health <= 0)
		{
		playerLives--;
		player.reset(100,100);
		}
	}
	

	player.visible =true;
	
	weaponInfoText.text = "Ammo: " + (weapon.fireLimit -  weapon.shots) + '/'+ weapon.fireLimit;
	hpText.text = 'HP:\n'+ player.health+'/'+ player.maxHealth;
	livesText.text = 'Lives: ' + playerLives;
	lvlText.text = 'Level: '+ lvl;
	
	myHealthBar.setPercent(player.health);
	myXPbar.setPercent(playerXP);
	
	
	
	enemy1HealthBar.setPosition(enemy1.position.x, enemy1.position.y-25);
	enemy1HealthBar.setPercent(enemy1.health);
	enemy1.visible =  true;
	
	
	if (player.scale.x< 0){
		weapon.bullets.x  = -45;
		weapon.bullets.y = -3;
	}
	if (player.scale.x >= 0){
		weapon.bullets.x  = 45;
		weapon.bullets.y = -3;
	}
	
	
	

	if (shootButton.isDown&& (!cursors.right.isDown) && (!cursors.left.isDown))
    {
		player.frame =45;
	
		weapon.fireAngle= game.input.activePointer.position.angle(player,game.input.activePointer);
		weapon.fireAngle+=180;
        weapon.fire();
    }
	
	else if (cursors.right.isDown&&shootButton.isDown){
		player.scale.x = .2;
        player.body.velocity.x = 150;
        player.animations.play('runshoot');
		weapon.fireAngle= game.input.activePointer.position.angle(player,game.input.activePointer);
		weapon.fireAngle+=180;
        weapon.fire();
		
	}
	else if (cursors.left.isDown&&shootButton.isDown){
		player.scale.x = -.2;
        player.body.velocity.x = -150;
        player.animations.play('runshoot');
		weapon.fireAngle= game.input.activePointer.position.angle(player,game.input.activePointer);
		weapon.fireAngle+=180;
        weapon.fire();
		
	}
	else if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('move');
		player.scale.x = -.2;
		
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
		player.scale.x = .2;
        player.body.velocity.x = 150;
        player.animations.play('move');

    }
	
	else if(reload.isDown){
		weapon.resetShots(30);
	}
	else if(player.body.velocity.y< 0){
				player.animations.play('jump');
				
	}
	else if(player.body.velocity.y > 0){
		player.frame = 18;
	}
    else
    {
       // Stand still
        player.animations.play('idle');
		player.body.velocity.x = 0;
    }
    
 
	if(jumpButton.isDown && player.body.touching.down)
    {
	
        player.body.velocity.y = -700;
		
    }
	
	
}


function healthPackCollision(player, healthPack){
	healthPack.kill();
	player.heal(10);
	
}

function bulletPlatformCollision(bullet, platforms)
{
	bullet.kill();
}

function bulletEnemyCollision(bullet, enemy)
{
	
	enemy.damage(10);
	bullet.kill();

	
	if(enemy.health==0){
		enemy1HealthBar.kill();
		enemy.destroy();
		playerXP+=170;
		if(playerXP>=100){
			playerXP = playerXP%100;
			lvl++;
		}
	}

}         