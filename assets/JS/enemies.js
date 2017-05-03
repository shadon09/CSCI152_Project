function simpleMeleeEnemy(game, x, y, key, group, player){
	var obj = game.add.sprite(x, y, key, 0, group);
	obj.health = 100;
	game.physics.arcade.enable(obj);
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
			obj.body.velocity.y = -650;
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
			if ((player.y < (obj.y-15)) && (Math.abs(xDistance) < 90) && (Math.abs(yDistance) < 200)){
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
					var bullet = game.add.sprite(obj.x, obj.y, 'bullet', 0, bullets);
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
