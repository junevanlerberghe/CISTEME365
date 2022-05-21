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
        console.log(sessionStorage.getItem("useCustomPIDCoeff"));

        //PID variables
        this.customCoeff = sessionStorage.getItem("useCustomPIDCoeff") == "true";
        this.coefficients = this.customCoeff ? this.parsePIDCoefficients(sessionStorage.getItem("customPIDCoefficients")) : [];
        if(this.coefficients.length > 0) {
            document.getElementById("pSlider").value = this.coefficients[0]
            document.getElementById("iSlider").value = this.coefficients[1]
            document.getElementById("dSlider").value = this.coefficients[2]

            document.getElementById("pval").innerHTML = this.coefficients[0]
            document.getElementById("ival").innerHTML = this.coefficients[1]
            document.getElementById("dval").innerHTML = this.coefficients[2]
        }

        this.errors = [0];
        this.historicPID = [[]]; // keeps track of PID values for each frame

        this.game = game;
        this.time = 0;
        
        this.updateMovementConst = true;
        
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }

    update(dt) {
        this.time++;

        if(!dt) return;
        if(this.updateMovementConst){
            this.updateMovement(dt);
        }
    }

    updateMovement(dt) {
        let output = this.getPID();

        // lgoddard edit
        if(true) {//this.time % 60 == 0) {  // update every other
            this.acceleration = output * this.maxAcceleration; //+= output; //*this.maxAcceleration; // output [-1, 1]
            if(this.acceleration>this.maxAcceleration) this.acceleration = this.maxAcceleration;
            if(this.acceleration<-this.maxAcceleration) this.acceleration = -this.maxAcceleration;
        }

        super.updateMovement(dt);        
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
 
        /*
        let Kp = this.customCoeff ? this.coefficients[0] : 1*0.5;
        let Ki = this.customCoeff ? this.coefficients[1] : 1*0.05;
        var Kd = this.customCoeff ? this.coefficients[2] : 1*0.5; 
        */
        this.sliderCoeffP = sessionStorage.getItem("pSlider")
        this.sliderCoeffI = sessionStorage.getItem("iSlider")
        this.sliderCoeffD = sessionStorage.getItem("dSlider")
        let Kd = this.sliderCoeffD
        let Ki = this.sliderCoeffI
        let Kp = this.sliderCoeffP
        console.log(Kd, Ki, Kp)
        
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
        
        let historicPIDScale = 60; //30; //150 / ((Math.abs(up) + Math.abs(ui) + Math.abs(ud))/3);
        this.historicPID.push([up * historicPIDScale, ui * historicPIDScale, ud * historicPIDScale]);
        //up * historicPIDScale, ui * historicPIDScale, this.velocity]); //ud * historicPIDScale]);
      //  this.historicPID.push([0.01*curr_err * historicPIDScale, 0.01*sum_error * historicPIDScale, 10*output * historicPIDScale]);

        // console.log(this.velocity);//up, ui, ud)

        return output;
        /*
        if(this.position.y < target_pos_y){
            output = 1*output;
        }
        */
        // console.log(curr_y);
        //console.log("y: " + this.position.y + ", v: " + this.velocity + ", a: " + this.acceleration);
    }


    /********************************
     * HELPER
     ********************************/
    parsePIDCoefficients(pidCoeff) {
        let pidCoeffSplit = pidCoeff.split(',');

        console.log(pidCoeffSplit);
        let output = [];

        for (let i = 0; i < pidCoeffSplit.length; i ++) { // start at i=1 bc first value in PID History is blank
            output.push(parseFloat(pidCoeffSplit[i]));
        }

        console.log(output);
        return output;
    }
}