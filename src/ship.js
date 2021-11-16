export default class Ship {
    constructor(gameWidth, gameHeight) {
        const img = new Image();
        img.src = "assets/shipicon.png";
        this.image = img;
        this.gameHeight = gameHeight
        this.gameWidth = gameWidth
        this.width = 80
        this.height = 80
        this.position = {
            x: 20,
            y: 20
        }
        this.maxSpeed = 4
        this.speed = 0
    }

    stop() {
        this.speed = 0
    }

    moveUp() {
        this.speed = -this.maxSpeed
    }

    moveDown() {
        this.speed = this.maxSpeed
    }

    draw(ctx) {
        // ctx.fillStyle = '#0ff'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(dt) {
        if(!dt) return;
        this.position.y += this.speed;

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height


    }
}