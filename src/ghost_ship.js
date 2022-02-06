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

        // lgoddard edit
        this.velocity += output*this.maxAcceleration;
        if(this.velocity>this.maxSpeed) this.velocity = this.maxSpeed;
        if(this.velocity<-this.maxSpeed) this.velocity = -this.maxSpeed;

        // no idea if this is right        
        // update accel to hit target y, but don't go past maxAccel
//        if (output > 0 && this.acceleration < this.maxAcceleration) {this.acceleration += this.deltaAcceleration; }
//        else if (output < 0 &&  this.acceleration > -this.maxAcceleration) {this.acceleration = this.acceleration -= this.deltaAcceleration; }
        // copy basic ship's movemnet
        super.updateMovement();
    }

    getPID() {
        /*let obstacle1_position = this.game.obstacle_pair.position1;
        let obstacle2_position = this.game.obstacle_pair.position2;
        let target_pos_y = (obstacle1_position.y + obstacle2_position.y + 400/2)/2;*/
        let upperbound = this.game.obstacle_pair.position2.y - this.game.obstacle_pair.minimumDistanceBetweenGlaciers*this.game.obstacle_pair.passageWidth;
        let lowerbound = this.game.obstacle_pair.position2.y;
        let target_pos_y = (lowerbound + upperbound)/2;
       
        let curr_y = this.position.y + 0.5 * this.height;
        /*
        let Ku = 10**-300;
        let Kp = 10**-300;
        let Ki = 0;
        let Kd = 0;
        */
       //calculated period: around 0.2 ms
        
        //let Kp = 0.000005;
        //let Ki = 0.0000001;
        //let Kd = 0.0005;
 
        let Kp = 1*0.5;
        let Ki = 1*0.005;
        let Kd = 1*0.5;
 
        
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
        
        let historicPIDScale = 30; //150 / ((Math.abs(up) + Math.abs(ui) + Math.abs(ud))/3);
        this.historicPID.push([up * historicPIDScale, ui * historicPIDScale, ui/up * historicPIDScale]);
      //  this.historicPID.push([0.01*curr_err * historicPIDScale, 0.01*sum_error * historicPIDScale, 10*output * historicPIDScale]);

        console.log(up, ui, ui/up)

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