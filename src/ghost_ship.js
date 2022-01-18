import Ship from './ship.js'

/**************************************************************
 * GHOST SHIP
 * ------------------------------------------------------------
 * ship which uses PID control to move smartly.
 * extends ship class, rewrites p much all major functions
 **************************************************************/
export default class GhostShip extends Ship {
    constructor(game) {
        super(game, 0.5);

        //PID variables
        this.errors = [0];
        this.historicPID = [[]]; // keeps track of PID values for each frame
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.globalAlpha = 1;
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
        let curr_y = this.position.y;
        let Ku = 10**-300;
        let Kp = 10**-300;
        let Ki = 0;
        let Kd = 0;
        //find a way to calculate period of oscillation here in order to find other constants
        /*
        doesnt work
        let count = 0;
        let Tu = 0;
        let initialPos = (this.game.gameHeight - this.height) / 2;
        let lastPos = curr_y;
        let currPos = curr_y;
        if(count == 0){
            if(curr_y > target_pos_y && lastPos > curr_y) {
                console.log("lower")
                Tu = lastPos;
                count += 1;
            } else if (curr_y < target_pos_y && lastPos < curr_y){
                console.log("higher")
                Tu = lastPos;
                count += 1;
            }
        }
        console.log(Tu)
        */
        /*
        let Kp = 0.000005;
        let Ki = 0.0000001;
        let Kd = 0.0005;
        */
        let curr_err = target_pos_y - curr_y;
        this.errors.push(curr_err);
   
        let sum_error = 0;
        for (let i = 0; i < this.errors.length; i++) {
            sum_error += this.errors[i];
        }

        let up = Kp*curr_err;
        let ui = Ki*sum_error;
        let ud = Kd*(curr_err - this.errors.at(-2));
        let output = up + ui + ud;
        
        let historicPIDScale = 150 / ((Math.abs(up) + Math.abs(ui) + Math.abs(ud))/3);
        this.historicPID.push([up * historicPIDScale, ui * historicPIDScale, ud * historicPIDScale]);

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