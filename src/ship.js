export default class Ship {
    constructor(game, wind) {
        const img = new Image();
        img.src = "assets/shipicon.png";
        this.image = img;
        this.gameHeight = game.gameHeight
        this.gameWidth = game.gameWidth
        this.width = 80
        this.height = 80
        this.position = {
            x: 20,
            y: (this.gameHeight - this.height) / 2
        }
        this.maxSpeed = 4
        this.speed = 0

        this.wind = wind;
        this.game = game;
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
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(dt) {
        if(!dt) return;
        this.position.y += this.speed + this.wind.currentVelocity;

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height

        let glacier_pair = this.game.glacier_pair
        let glacier1_position = this.game.glacier_pair.position1
        let glacier2_position = this.game.glacier_pair.position2
        let ship = this.game.ship

        //if ship hits middle of glacier 1
        if(ship.position.x > glacier1_position.x && (ship.position.y + ship.height/2) > glacier1_position.y && (ship.position.y - ship.height/2) < glacier1_position.y) {
            this.game.lives--;
        }
        //if ship hits middle of glacier 2
        if(ship.position.x > glacier2_position.x && (ship.position.y + ship.height/2) > glacier2_position.y && (ship.position.y - ship.height/2) < glacier2_position.y) {
            this.game.lives--;
        }

    }
}