Defender.Game = function (game) {
    this.totalBunnies;
    this.bunnyGroup;
    this.totalSpaceRocks;
    this.spaceRocksGroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overMessage;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.bum;
    this.ding;
};

Defender.Game.prototype = {
    create: function () {
        this.gameover = false;
        this.secondsElapsed = 0;
        this.timer = this.time.create(false);
        this.timer.loop(1000, this.updateSeconds, this);
        this.totalBunnies = 20;
        this.totalSpaceRocks = 13;
        
        this.music = this.add.audio('game-audio');
        this.music.play('', 0, 0.3, true);
        this.ouch = this.add.audio('hurt-audio');
        this.bum = this.add.audio('explosion-audio');
        this.ding = this.add.audio('select-audio');
        
        this.buildWorld();
    },
    
    buildWorld: function () {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 800, 'hill');
        this.buildBunnies();
        this.buildSpaceRocks();
        this.buildEmitter();
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Bunnies left: ' + this.totalBunnies, 20);
        this.timer.start();
    },
    
    buildBunnies: function () {
        this.bunnyGroup = this.add.group();
        this.bunnyGroup.enableBody = true;
        
        for (var i = 0; i < this.totalBunnies; i++) {
            var b = this.bunnyGroup.create(this.rnd.integerInRange(-10, this.world.width - 50), this.rnd.integerInRange(this.world.height - 180, this.world.height - 60), 'bunny', 'Bunny0000');
            b.anchor.setTo(0.5, 0.5);
            b.body.moves = false;
            b.animations.add('Rest', this.game.math.numberArray(1, 58));
            b.animations.add('Walk', this.game.math.numberArray(68, 107));
            b.animations.play('Rest', 24, true);
            this.assignBunnyMovement(b);
        }
    },
    
    assignBunnyMovement: function (b) {
        bposition = Math.floor(this.rnd.realInRange(50, this.world.width - 50));
        bdelay = this.rnd.integerInRange(2000, 6000);
        if (bposition < b.x) {
            b.scale.x = 1;
        } else {
            b.scale.x = -1;
        }
        
        t = this.add.tween(b).to({x: bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onStart.add(this.startBunny, this);
        t.onComplete.add(this.stopBunny, this);
    },
    
    startBunny: function (b) {
        b.animations.stop('Play');
        b.animations.play('Walk', 24, true);
    },
    
    stopBunny: function (b) {
        b.animations.stop('Walk');
        b.animations.play('Rest', 24, true);
        this.assignBunnyMovement(b);
    },
    
    buildSpaceRocks: function () {
        this.spaceRocksGroup = this.add.group();
        
        for (var i = 0; i < this.totalSpaceRocks; i++) {
            var r = this.spaceRocksGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spaceRock', 'SpaceRock0000');
            var scale = this.rnd.realInRange(0.3, 1.0);
            r.scale.x = scale;
            r.scale.y = scale;
            this.physics.enable(r, Phaser.Physics.ARCADE);
            r.enableBody = true;
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
            r.animations.add('Fall');
            r.animations.play('Fall', 24, true);
            r.checkWorldBounds = true;
            r.events.onOutOfBounds.add(this.resetRock, this);
        }
        
    },
    
    resetRock: function (r) {
        if (r.y > this.world.height) {
            this.respawnRock(r);
        }
    },
    
    respawnRock: function (r) {
        if (this.gameover == false) {
            r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },
    
    buildEmitter: function () {
        this.burst = this.add.emitter(0, 0, 80);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;
        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);
        this.burst.makeParticles('explosion');
        this.input.onDown.add(this.fireBurst, this);
    },
    
    fireBurst: function (pointer) {
        if (this.gameover == false) {
            this.burst.emitX = pointer.x;
            this.burst.emitY = pointer.y;
            this.burst.start(true, 2000, null, 20);
            this.bum.play();
            this.bum.volume = 0.2;
        }
    },
    
    update: function () {
        this.physics.arcade.overlap(this.spaceRocksGroup, this.burst, this.burstCollision, null, this);
        this.physics.arcade.overlap(this.spaceRocksGroup, this.bunnyGroup, this.bunnyCollision, null, this);
        this.physics.arcade.overlap(this.bunnyGroup, this.burst, this.friendlyFire, null, this);
    },
    
    burstCollision: function (r, b) {
        this.respawnRock(r);
    },
    
    bunnyCollision: function (r, b) {
        if (b.exists) {
            this.makeGhost(b);
            this.respawnRock(r);
            b.kill();
            this.totalBunnies--;
            this.checkBunniesLeft();
            this.ouch.play();
        }
    },
    
    checkBunniesLeft: function () {
        if (this.totalBunnies <= 0) {
            this.gameover = true;
            this.music.stop();
            this.countdown.setText('Bunnies left: 0');
            this.overMessage = this.add.bitmapText(this.world.centerX - 180, this.world.centerY - 40, 'eightbitwonder', 'Game Over\n\n' + this.secondsElapsed, 42);
            this.overMessage.align = 'center';
            this.overMessage.inputEnabled = true;
            this.overMessage.events.onInputDown.addOnce(this.quitGame, this);
        } else {
            this.countdown.setText('Bunnies left: ' + this.totalBunnies);
        }
    },
    
    friendlyFire: function (b, f) {
        if (b.exists) {
            this.makeGhost(b);
            b.kill();
            this.totalBunnies--;
            this.checkBunniesLeft();
            this.ouch.play();
        }
    },
    
    makeGhost: function (b) {
        bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
        bunnyghost.anchor.setTo(0.5, 0.5);
        bunnyghost.scaleX = b.scale.x;
        this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
        bunnyghost.enableBody = true;
        bunnyghost.checkWorldBounds = true;
        bunnyghost.body.velocity.y = -800;
    },
    
    updateSeconds: function () {
        this.secondsElapsed++;
    },
    
    quitGame: function (pointer) {
        this.ding.play();
        this.state.start('StartMenu');
    }
}