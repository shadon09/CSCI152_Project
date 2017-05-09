function createPlayer(game, x, y, playerSpriteSheet, bulletIMG){
	var obj = game.add.sprite(x, y, playerSpriteSheet);
  game.physics.arcade.enable(obj);
  obj.scale.set(.1, .1);
  obj.xp = 0;
	obj.health = 1000;
  obj.maxHealth = 1000;
	//obj.body.collideWorldBounds = true;
  obj.fireRate = 100;
  obj.nextFire = 0;

	obj.body.bounce.y = 0;
	obj.body.gravity.y = 1000;
	obj.body.gravity.x = 0;
	obj.body.velocity.x = 0;
	obj.anchor.setTo(.5, .5);

  obj.bullets = game.add.group();
  obj.bullets.enableBody = true;
  obj.bullets.physicsBodyType = Phaser.Physics.ARCADE;

  obj.bullets.createMultiple(50, bulletIMG);
  obj.bullets.setAll('checkWorldBounds', true);
  obj.bullets.setAll('outOfBoundsKill', true);

	obj.fire = function() {
    if(obj.alive){
  		if (game.time.now > obj.nextFire && obj.bullets.countDead() > 0){
      		obj.nextFire = game.time.now + obj.fireRate;

      		pbullet = obj.bullets.getFirstDead();
          pbullet.dmg = 20;
     			pbullet.reset(obj.x - 8, obj.y - 8);

      		game.physics.arcade.moveToPointer(pbullet, 2500);
  		}
    }
	};

  return obj;
}
