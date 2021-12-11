export default class GhostShip {
    constructor(game) {
        // graphics
        const img = new Image();
        img.src = "assets/ghost_ship.png";
        this.image = img;
        this.image.style.opacity = '0.1';
        this.alpha = 1;

        // sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = game.ship.width;
        this.height = game.ship.height;

        // kinematics
        this.position = JSON.parse(JSON.stringify(game.ship.position));
        this.maxSpeed = game.ship.maxSpeed;
        this.velocity = game.ship.velocity;

        this.maxAcceleration = game.ship.maxAcceleration;
        this.acceleration = game.ship.acceleration;
        this.deltaAcceleration = game.ship.deltaAcceleration;

        // game variables
        this.wind = game.wind;
        this.game = game;

        //PID variables
        this.errors = [0];
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update(dt) {
        if(!dt) return;
        this.updateMovement();
        
    }

    updateMovement() {
        let glacier1_position = this.game.glacier_pair.position1;
        let glacier2_position = this.game.glacier_pair.position2;

        let target_pos_x = glacier1_position.x;
        let target_pos_y = (glacier1_position.y + glacier2_position.y)/2;
        let curr_x = this.game.ghost_ship.position.x;
        let curr_y = this.game.ghost_ship.position.y;

        let Kp = 0.015;
        let Ki = 0.004;
        let Kd = 0.3;

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

        if(this.position.y > target_pos_y){
            output = 1*output;
        }
        console.log(output);
        console.log("y: " + this.position.y + ", v: " + this.velocity + ", a: " + this.acceleration);
        
        // attempted acceleration-based change
        this.acceleration += (output > 0  ? (this.acceleration < this.maxAcceleration ? this.deltaAcceleration : 0)
                                                 : (this.acceleration > -this.maxAcceleration ? -this.deltaAcceleration : 0));
        this.velocity += (this.acceleration > 0  ? (this.velocity < this.maxSpeed ? this.acceleration : 0)
                                                 : (this.velocity > -this.maxSpeed ? this.acceleration : 0));
        this.position.y += this.velocity + this.wind.currentVelocity;

        // og code
        // this.position.y += (output + this.speed + this.wind.currentVelocity)//this.wind.currentVelocity + output);

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height;
    }
}