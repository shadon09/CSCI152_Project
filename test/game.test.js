describe('mainState', function() {
  describe('create', function () {
    it('There should be a player', function () {
      expect(player).to.be.not.equal(null);
    });
  });
});

describe('mainState', function() {
  describe('create', function () {
    it('Player health should be in the range 0 to 100', function () {
      expect(player.health).to.be.within(0,100);
    });
  });
});


describe('mainState', function() {
  describe('create', function () {
    it('There should be at least one melee enemy', function () {
      expect(mainState.simpleMeleeEnemies.length).to.be.above(0);
    });
  });
});


describe('mainState', function() {
  describe('create', function () {
    it('There should be at least one shooting enemy', function () {
      expect(mainState.simpleShootingEnemies.length).to.be.above(0);
    });
  });
});


describe('mainState', function() {
  describe('create', function () {
    it('There should only be one boss', function () {


      expect(mainState.firstBoss.length).to.be.equal(1);
    });
  });
});


