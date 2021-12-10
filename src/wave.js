import Game from "./game.js";

export default class Wave {
    constructor(game){
        // graphics
        this.wavePaths = ["./assets/wave2.png", "./assets/wave3.png"];
        this.waveType = 0;
        const img = new Image();
        img.src = this.generateWaveImagePath();
        this.image = img;
        this.alpha = 1;
        
        // positioning + sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;       
        this.width = this.generateWidth();
        this.height = 12;
        this.startPosition = this.generateStartPosition();
        this.endPosition = this.generateEndPosition();
        this.currentPosition = this.startPosition;
        this.midPosition = {
            x: (this.startPosition.x + this.endPosition.x)/2,
            y: (this.startPosition.y + this.endPosition.y)/2
        };

        // movement
        this.speed = 5;
    }

    update(dt) {
        if (!dt) return;

        this.currentPosition.x -= this.speed;
        this.opacityControl()
        // when object hits endPosition delete it
        if (this.currentPosition.x < this.endPosition.x) {
            this.generateWave();
        }
    }
        
    draw(ctx){
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.currentPosition.x, this.currentPosition.y, this.width, this.height);
    }

    // wave creation
    // perhaps consider if there are more efficient ways of doing this later (not repeating code in header;
    // make new wave vs. reuse wave w/ new data)
    generateWave() {
        this.generateWaveImage();
        this.startPosition = this.generateStartPosition();
        this.endPosition = this.generateEndPosition();
        this.currentPosition = this.startPosition;
        this.width = this.generateWidth();
    }
    generateWaveImage() {
        // 50% chance of short wave image or long wave image
        // find if there's a better way of doing this TT
        const img = new Image();
        img.src = this.generateWaveImagePath();
        this.image = img;
    }
    generateWaveImagePath() {
        this.waveType = Math.round(Math.random());
        return this.wavePaths[this.waveType];
    }
    generateStartPosition() {
        return { x: this.gameWidth + Math.random() * 600 - 200, y: Math.random() * (this.gameHeight - this.height) }
    }
    generateEndPosition() {
        return {x: 0 - Math.random() * 600, y: this.startPosition.y}
    }
    generateWidth() {
        return (this.waveType === 0) ? (909/158) * this.height : (605/158) * this.height;
    }
    opacityControl() {
        if (this.currentPosition.x > this.midPosition.x){
            this.alpha += 0.015
            //this is to prevent a glitch. weird glitch happens when opacity is greater than 1 (this.alpha < 0)
            if (this.alpha > 0.95){
                this.alpha = 1
            }
        }
        if (this.currentPosition.x < this.midPosition.x){
            this.alpha -= 0.015
            //this is to prevent a glitch. weird glitch happens when opacity is less than 0 (this.alpha < 0)
            if (this.alpha < 0.05){
                this.alpha = 0
            }
        }
        
    }
}