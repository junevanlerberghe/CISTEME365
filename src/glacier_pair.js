export default class glacier_pair {
    constructor(game) {
        const img = new Image();
            img.src = "./assets/iceberg.png";

        this.image = img;
        this.gameHeight = game.gameHeight
        this.gameWidth = game.gameWidth
        this.width = 50
        this.height = 50
        this.position1 = {
            x:  this.gameWidth + 50,
            y: 100
        }
        this.position2 = {
            x:  this.gameWidth + 50,
            y: 400
        }
        this.maxSpeed = 5;
        this.speed = 9;
        this.game = game;
    }
    update(dt) {
        if(!dt) return;
        this.position1.x -= this.speed;
        this.position2.x -= this.speed;
        if (this.position1.x + this.width < -10) {
            this.position1.x = this.gameWidth + 10;
            this.position2.x = this.gameWidth + 10;
            //first glacier can only be in first half of screen
            this.position1.y = Math.random() * (this.gameHeight/2 - this.height);
            //second glacier is a minimum of 200px away from first plus random dist up to 80
            //this is to make sure the distance is never less than the height of the ship
            this.position2.y = this.position1.y + 4*this.height + Math.random()*80
            this.game.icebergCount += 1;
        }
    }
    draw(ctx) {
        // ctx.fillStyle = '#0ff'
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        // ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.image, this.position1.x, this.position1.y, 100, 100);
        ctx.drawImage(this.image, this.position2.x, this.position2.y, 100, 100);
    }
}