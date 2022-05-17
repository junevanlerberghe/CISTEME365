/**************************************************************
 * SHIP
 * ------------------------------------------------------------
 * base class for ship! note that this class is both the class
 * for the player's movable ship AND serves as parent class for
 * the ghost ship
 **************************************************************/
export default class Ship {
    constructor(game, alpha = 1) {
        // graphics
        const img = new Image();
        img.src = "assets/shipicon_crop.png";
        this.image = img;
        this.alpha = alpha;

        // sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 80;
        this.height = 58;

        // kinematics
        this.updateMovementConst = true;
        this.position = {
            x: 60,
            y: (this.gameHeight - this.height) / 2
        };
        this.maxSpeed = 9999999999999999;//40;//4;
        this.velocity = 0;

        this.maxAcceleration = 0.5; //2;
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
        this.infiniteLivesMode = false; // testing make sure to set to false before exporting

        this.m = 1;
        this.g = -0.005;
        this.F = 0.01;
        this.b = 0.01;
    }

    /**********************************************************
     * kinematics
     **********************************************************/
    stop() {
        // this.speed = 0;
        this.acceleration = 0;
    }

    moveUp() {
        // this.speed = -this.maxSpeed;
        //this.acceleration += (this.acceleration > -this.maxAcceleration ? -this.deltaAcceleration : 0);
        //if (this.acceleration < -this.maxAcceleration) this.acceleration = -this.maxAcceleration;

        this.acceleration = -this.maxAcceleration;
    }

    moveDown() {
        // this.speed = this.maxSpeed;
        //this.acceleration += (this.acceleration < this.maxAcceleration ? this.deltaAcceleration : 0);
        //if (this.acceleration > this.maxAcceleration) this.acceleration = this.maxAcceleration;

        this.acceleration = this.maxAcceleration;
    }

    /**********************************************************
     * game object (draw/update)
     **********************************************************/
    draw(ctx) {
        ctx.globalAlpha = this.alpha;

        if (!this.isCurrentlyImmune() || (this.isCurrentlyImmune() && this.blinkOnPhase)) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }

        ctx.globalAlpha = 1;
    }

    update(dt) {
        if(!dt) return;
        // update velocity w/ respect to accel, but don't go past maxSpeed
        //if (this.acceleration > 0 && this.velocity < this.maxSpeed) { this.velocity += this.acceleration; }
        //else if (this.acceleration < 0 &&  this.velocity > -this.maxSpeed) { this.velocity += this.acceleration; }
        if (this.updateMovementConst){
            this.updateMovement(dt);
        }
        this.checkCollisions();
        console.log('ship update')
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

    updateMovement(dt) {
        //new velocity
        this.prevVelocity = this.velocity
        this.velocity = this.prevVelocity + dt*(this.F*this.acceleration - this.g*this.game.wind.currentVelocity - this.b*this.prevVelocity)/this.m
        this.position.y += dt*(this.prevVelocity + this.velocity)/2.0

        // update position w/ respect to velocity (including wind)
        //this.position.y += this.game.velocityConstant * (this.velocity + this.wind.currentVelocity);
        // console.log("x: " + this.position.y + ", v: " + this.velocity + ", a: " + this.acceleration);

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height;
    }

    /**********************************************************
     * collisions
     **********************************************************/
    checkCollisions() {
        if (this.shipCollided() && !this.isCurrentlyImmune()) {
            if (!this.infiniteLivesMode) this.loseLife();
            this.immunityTime = this.defaultImmunityTime;
            this.velocity = 0;
            this.acceleration = 0;
        }
    }
    
    shipCollided() {
        let obstacle_pair = this.game.obstacle_pair;
        let obstacle1_position = obstacle_pair.position1;
        let obstacle2_position = obstacle_pair.position2;
        let ship = this;

        // if ship is in same x as glacier
        if (ship.position.x > obstacle1_position.x && ship.position.x + ship.width < obstacle1_position.x + obstacle_pair.width) {
            // if ship is not in-between the two glaciers
            if (ship.position.y < obstacle1_position.y + obstacle_pair.height || ship.position.y + ship.height > obstacle2_position.y) {
                return true;
            }
        }
        
        return false;
    }

    // immunity feature: when ship hits iceberg, short temporary period of immunity
    // otherwise you lose a life for each millisecond you hit the glacier
    isCurrentlyImmune() { return this.immunityTime > 0; }
    loseLife() {
        if (this.game.lives > 0) this.game.lives--;
    }
}