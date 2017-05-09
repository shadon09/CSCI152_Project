describe('Melee enemy', function () {
  it('should pursue the player to the left', function (done) {
  var player = {
      alive: true,
      x: 0,
      y: 0
    };

    var obj = {
      x: 250,
      y: 0,
      velocity: {x:0, y:0},
      pursue: function(player) {
        if(player.alive){
          var xDistance = player.x - obj.x;
      		var yDistance = player.y - obj.y;

          // when player is to the left of enemy, and within a certain distance
      		if (xDistance < -25 && xDistance > -300) {
      		  // if the player isn't too far away in the y direction and there isn't a cliff to the left of the enemy
      		  if (yDistance < 200) {
      				obj.velocity.x = -250;
      			}
          }
        }
        return obj.velocity.x;
      }
    };

    expect(obj.pursue(player)).to.be.equal(-250);
    done();
  });
});

describe('Melee enemy', function () {
  it('should pursue the player to the right', function (done) {
  var player = {
      alive: true,
      x: 250,
      y: 0
    };

    var obj = {
      x: 0,
      y: 0,
      velocity: {x:0, y:0},
      pursue: function(player) {
        if(player.alive){
          var xDistance = player.x - obj.x;
      		var yDistance = player.y - obj.y;

          // when player is to the left of enemy, and within a certain distance
      		if (xDistance > 25 && xDistance < 300) {
      		  // if the player isn't too far away in the y direction and there isn't a cliff to the left of the enemy
      		  if (yDistance < 200) {
      				obj.velocity.x = 250;
      			}
          }
        }
        return obj.velocity.x;
      }
    };

    expect(obj.pursue(player)).to.be.equal(250);
    done();
  });
});

describe('Melee enemy', function () {
  it('should jump to the player above', function (done) {
  var player = {
      alive: true,
      x: 0,
      y: -250
    };

    var obj = {
      x: 0,
      y: 0,
      velocity: {x:0, y:0},
      jump: function() {
    			return -700;
    	},
      pursue: function(player) {
        if(player.alive){
          var xDistance = player.x - obj.x;
      		var yDistance = player.y - obj.y;

          if ((player.y < (obj.y-25)) && (Math.abs(xDistance) < 90) && (Math.abs(yDistance) < 300)){
    				obj.velocity.y = obj.jump();
    			}
        }

        return obj.velocity.y;
      }
    };

    expect(obj.pursue(player)).to.be.equal(-700);
    done();
  });
});

describe('Shooting enemy', function () {
  it('should shoot at player', function (done) {
  var player = {
      alive: true,
      x: -499,
      y: -499
    };

    var obj = {
      x: 0,
      y: 0,
      fire: function(player) {
        if(player.alive){
          var xDistance = Math.abs(player.x - obj.x);
          var yDistance = Math.abs(player.y - obj.y);

          return (xDistance < 500 && yDistance < 500)
    	  }
      }
    };

    expect(obj.fire(player)).to.be.equal(true);
    done();
  });
});
