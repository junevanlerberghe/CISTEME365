import Game from "./game.js";

export default class Wave {

    constructor(game){
        // graphics
        const img = new Image();
        img.src = this.generateWaveImagePath();
        this.image = img;
        this.alpha = 1;

        // positioning + sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;       
        this.width = 40;
        this.height = 40;
        this.startPosition = this.generateStartPosition();
        this.endPosition = {
            x: -this.width,
            y: this.startPosition.y
        };
        this.currentPosition = this.startPosition;

        // movement
        this.speed = 5;
    }

    update(dt) {
        if (!dt) return;

        this.currentPosition.x -= this.speed;
        
        // when object hits endPosition delete it
        if (this.currentPosition.x < this.endPosition.x) {
            this.generateWave();
        }
    }
        
    draw(ctx){
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.currentPosition.x, this.currentPosition.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }

    // wave creation
    // perhaps consider if there are more efficient ways of doing this later (not repeating code in header;
    // make new wave vs. reuse wave w/ new data)
    generateWave() {
        this.generateWaveImage();
        this.startPosition = this.generateStartPosition();
        this.currentPosition = this.startPosition;
    }
    generateWaveImage() {
        // 50% chance of short wave image or long wave image
        // find if there's a better way of doing this TT
        const img = new Image();
        img.src = this.generateWaveImagePath();
        this.image = img;
    }
    generateWaveImagePath() {
        return Math.random() < 0.5 ? "./assets/wave2.png" : "./assets/wave3.png";
    }
    generateStartPosition() {
        return { x: this.gameWidth + Math.random() * 600, y: Math.random() * (this.gameHeight - this.height) }
    }
}