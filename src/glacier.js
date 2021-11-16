export default class glacier {
    constructor(gameWidth, gameHeight) {
        const img = new Image();
            img.src = "./assets/iceberg.png";

        this.image = img;
        this.gameHeight = gameHeight
        this.gameWidth = gameWidth
        this.width = 50
        this.height = 50
        this.position = {
            x:  50,
            y: 200
        }
        this.maxSpeed = 5;
        this.speed = 10;
    }
    update(dt) {
        if(!dt) return;
        this.position.x -= this.speed;
        if (this.position.x + this.width < 0) {
            this.position.x = this.gameWidth + 10;
            this.position.y = Math.random() * (this.gameHeight - 2*this.height);
        }
    }
    draw(ctx) {
        // ctx.fillStyle = '#0ff'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        // ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.image, this.position.x, this.position.y, 100, 100);
    }
}