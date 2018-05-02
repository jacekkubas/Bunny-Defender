Defender.Preloader = function (game) {
    this.preloadeBar = null;
    this.titleText = null;
    this.ready = false;
}

Defender.Preloader.prototype = {
    preload: function () {
        this.preloadeBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
        this.preloadeBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadeBar);
        this.titleText = this.add.image(this.world.centerX, this.world.centerY - 220, 'titleImage');
        this.titleText.anchor.setTo(0.5, 0.5);
        this.load.image('titleScreen', 'images/TitleBG.png');
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        this.load.image('hill', 'images/hill.png');
        this.load.image('sky', 'images/sky.png');
        this.load.atlasXML('bunny', 'images/spritesheets/bunny.png', 'images/spritesheets/bunny.xml');
        this.load.atlasXML('spaceRock', 'images/spritesheets/SpaceRock.png', 'images/spritesheets/SpaceRock.xml');
        this.load.image('explosion', 'images/explosion.png');
        this.load.image('ghost', 'images/ghost.png');
        this.load.audio('explosion-audio', 'audio/explosion.mp3');
        this.load.audio('hurt-audio', 'audio/hurt.mp3');
        this.load.audio('select-audio', 'audio/select.mp3');
        this.load.audio('game-audio', 'audio/bgm.mp3');
    },
    
    create: function () {
        this.preloadeBar.cropEnabled = false;
    },
    
    update: function () {
        if (this.cache.isSoundDecoded('game-audio') && this.ready == false) {
            this.ready = true;
            this.state.start('StartMenu');
        }
    }
}