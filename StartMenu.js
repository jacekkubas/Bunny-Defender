Defender.StartMenu = function (game) {
    this.StartBG;
    this.StartPrompt;
    this.ding;
}

Defender.StartMenu.prototype = {
    create: function () {
        this.ding = this.add.audio('select-audio');
        StartBG = this.add.image(0, 0, 'titleScreen');
        StartBG.inputEnabled = true;
        StartBG.events.onInputDown.addOnce(this.startGame, this);
        
        StartPrompt = this.add.bitmapText(this.world.centerX - 150, this.world.centerY + 180, 'eightbitwonder', 'Touch to Start!', 24);
    },
    
    startGame: function (pointer) {
        this.ding.play();
        this.state.start('Game');
    }
}