var Defender = {};

Defender.Boot = function (game) {};

Defender.Boot.prototype = {
    preload: function () {
        this.load.image('preloadBar', 'images/loader_bar.png');
        this.load.image('titleImage', 'images/TitleImage.png');
    },
    
    create: function () {
        this.input.maxPointer = 1;
        this.stage.disableVisibilityChange = false;
        this.scale.scaleNode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 270;
        this.scale.minHeight = 480;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.stage.forcePortrait = true;
        this.scale.setScreenSize(true);
        
        this.input.addPointer();
        this.stage.backgroundColor = '#171642';
        
        this.state.start('Preloader');
    }
}