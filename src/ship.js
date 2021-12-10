export default class Ship {
    constructor(game) {
        // graphics
        const img = new Image();
        img.src = "assets/shipicon.png";
        this.image = img;
        this.alpha = 1;

        // sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 80;
        this.height = 80;

        // kinematics
        this.position = {
            x: 60,
            y: (this.gameHeight - this.height) / 2
        };
        this.maxSpeed = 4;
        this.velocity = 0;

        this.maxAcceleration = 2;
        this.acceleration = 0;
        this.deltaAcceleration = 0.5;

        // game variables
        this.wind = game.wind;
        this.game = game;

        // collision stuff
        this.defaultImmunityTime = 30;
        this.immunityTime = 0;
        this.blinkOnPhase = false; // if true, ship is not drawn (so a flashing effect is created)
        this.blinkPhaseLength = 7;
        this.infiniteLivesMode = true; // make sure to set to false before exporting
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
        ctx.globalAlpha = this.alpha;

        if (!this.isCurrentlyImmune() || (this.isCurrentlyImmune() && this.blinkOnPhase)) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update(dt) {
        if(!dt) return;
        this.updateMovement();
        this.checkCollisions();

        if (this.isCurrentlyImmune()) {
            this.immunityTime--;
            
            if (this.immunityTime == 1) {
                // reset the blink phase to off whenever immunity is about to expire.
                this.blinkOnPhase = false;
            } else if (this.immunityTime % this.blinkPhaseLength == 0) {
                this.blinkOnPhase = !this.blinkOnPhase;
            }
        }
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
        if (this.shipCollided() && !this.isCurrentlyImmune()) {
            if (!this.infiniteLivesMode) this.loseLife();
            this.immunityTime = this.defaultImmunityTime;
            this.velocity = 0; // consider physical/visual ways to notify player of being hit
            this.acceleration = 0;
        }
    }

    // We need to modify this function to detect collision with shore of canal instead----------------------------------------------

    shipCollided() {
        let glacier_pair = this.game.glacier_pair;
        let glacier1_position = this.game.glacier_pair.position1;
        let glacier2_position = this.game.glacier_pair.position2;
        let ship = this.game.ship;

        //if ship hits middle of glacier 1
        if(ship.position.x > glacier1_position.x && (ship.position.y + ship.height/2) > glacier1_position.y && (ship.position.y - ship.height/2) < glacier1_position.y) {
            return true;
        }
        //if ship hits middle of glacier 2
        if(ship.position.x > glacier2_position.x && (ship.position.y + ship.height/2) > glacier2_position.y && (ship.position.y - ship.height/2) < glacier2_position.y) {
            return true;
        }
        //if ship hits top of glacier 1
        if(ship.position.x > glacier1_position.x && (ship.position.y + ship.height/2) > glacier1_position.y - glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier1_position.y - glacier_pair.height/2) {
            return true;
        }
        //if ship hits top of glacier 2
        if(ship.position.x > glacier2_position.x && (ship.position.y + ship.height/2) > glacier2_position.y - glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier2_position.y - glacier_pair.height/2) {
            return true;
        }
        //if ship hits bottom of glacier 1
        if(ship.position.x > glacier1_position.x && (ship.position.y + ship.height/2) > glacier1_position.y + glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier1_position.y + glacier_pair.height/2) {
            return true;
        }
        //if ship hits bottom of glacier 2
        if(ship.position.x > glacier2_position.x && (ship.position.y + ship.height/2) > glacier2_position.y + glacier_pair.height/2 && (ship.position.y - ship.height/2) < glacier2_position.y + glacier_pair.height/2) {
            return true;
        }
        // ship didn't hit anything
        return false;
    }

    // immunity feature: when ship hits iceberg, short temporary period of immunity
    // otherwise you lose a life for each millisecond you hit the glacier
    isCurrentlyImmune() { return this.immunityTime > 0; }
    loseLife() {
        if (this.game.lives > 0) this.game.lives--;
    }
}