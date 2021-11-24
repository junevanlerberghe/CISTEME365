export default class Ship {
    constructor(game) {
        const img = new Image();
        img.src = "assets/shipicon.png";
        this.image = img;

        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;

        this.width = 80;
        this.height = 80;
        this.position = {
            x: 20,
            y: (this.gameHeight - this.height) / 2
        };
        this.maxSpeed = 4;
        this.velocity = 0;

        this.maxAcceleration = 2;
        this.acceleration = 0;
        this.deltaAcceleration = 0.5;

        this.wind = game.wind;
        this.game = game;


        this.infiniteLivesMode = true;
    }

    stop() {
        // this.speed = 0;
        this.acceleration = 0;
    }

    moveUp() {
        // this.speed = -this.maxSpeed;
        this.acceleration += (this.acceleration > -this.maxAcceleration ? -this.deltaAcceleration : 0);
    }

    moveDown() {
        // this.speed = this.maxSpeed;
        this.acceleration += (this.acceleration < this.maxAcceleration ? this.deltaAcceleration : 0);
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(dt) {
        if(!dt) return;
        this.updateMovement();
        this.checkCollisions();
    }

    updateMovement() {
        this.velocity += (this.acceleration > 0  ? (this.velocity < this.maxSpeed ? this.acceleration : 0)
                                                 : (this.velocity > -this.maxSpeed ? this.acceleration : 0));
        this.position.y += this.velocity + this.wind.currentVelocity;
        // console.log("x: " + this.position.y + ", v: " + this.velocity + ", a: " + this.acceleration);

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height;
    }

    checkCollisions() {
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
        //if ship hits top of glacier 1
        if(ship.position.x > glacier1_position.x && (ship.position.y + ship.height/2) > glacier1_position.y - glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier1_position.y - glacier_pair.height/2) {
            this.game.lives--;
        }
        //if ship hits top of glacier 2
        if(ship.position.x > glacier2_position.x && (ship.position.y + ship.height/2) > glacier2_position.y - glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier2_position.y - glacier_pair.height/2) {
            this.game.lives--;
        }
        //if ship hits bottom of glacier 1
        if(ship.position.x > glacier1_position.x && (ship.position.y + ship.height/2) > glacier1_position.y + glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier1_position.y + glacier_pair.height/2) {
            this.game.lives--;
        }
        //if ship hits bottom of glacier 2
        if(ship.position.x > glacier2_position.x && (ship.position.y + ship.height/2) > glacier2_position.y + glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier2_position.y + glacier_pair.height/2) {
            this.game.lives--;
        }
    

        if (this.infiniteLivesMode) this.game.lives = 99;
    }
}