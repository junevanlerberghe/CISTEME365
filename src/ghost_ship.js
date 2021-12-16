import Ship from './ship.js'

/**************************************************************
 * GHOST SHIP
 * ------------------------------------------------------------
 * ship which uses PID control to move smartly.
 * extends ship class, rewrites p much all major functions
 **************************************************************/
export default class GhostShip extends Ship {
    constructor(game) {
        super(game);

        // graphical differences
        this.alpha = 0.5;

        //PID variables
        this.errors = [0];
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(dt) {
        if(!dt) return;
        this.updateMovement();
    }

    updateMovement() {
        let output = this.getPID();
        // console.log(output);

        // no idea if this is right        
        // update accel to hit target y, but don't go past maxAccel
        if (output > 0 && this.acceleration < this.maxAcceleration) { this.acceleration += this.deltaAcceleration; }
        else if (output < 0 &&  this.acceleration > -this.maxAcceleration) { this.acceleration -= this.deltaAcceleration; }
        // copy basic ship's movemnet
        super.updateMovement();
    }

    getPID() {
        let obstacle1_position = this.game.obstacle_pair.position1;
        let obstacle2_position = this.game.obstacle_pair.position2;

        let target_pos_y = (obstacle1_position.y + obstacle2_position.y + this.game.obstacle_pair.height/2)/2;
        //this isn't working, curr_y is NaN
        //let curr_y = this.game.ghost_ship.position.y;
        let curr_y = this.position.y

        let Kp = 0.000005;
        let Ki = 0.0000001;
        let Kd = 0.0005;

        let curr_err = target_pos_y - curr_y
        this.errors.push(curr_err);

        let sum_error = 0;
        for (let i = 0; i < this.errors.length; i++) {
            sum_error += this.errors[i];
        }

        let up = Kp*curr_err
        let ui = Ki*sum_error
        let ud = Kd*(curr_err - this.errors.at(-2))
        let output = up + ui + ud
        
        return output;
        /*
        if(this.position.y < target_pos_y){
            output = 1*output;
        }
        */
        // console.log(curr_y);
        //console.log("y: " + this.position.y + ", v: " + this.velocity + ", a: " + this.acceleration);
    }
}