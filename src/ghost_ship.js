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
        this.width = 80;
        this.height = 80;

        // kinematics
        this.position = {
            x: 20,
            y: (this.gameHeight - this.height) / 2
        };
        this.maxSpeed = 4;
        this.speed = 2;

        // game variables
        this.wind = game.wind;
        this.game = game;
        this.immunityTime = 0;
        this.infiniteLivesMode = false; // make sure to set to false before exporting

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
        //console.log(output);
        //not sure how to use output to change velocity/acceleration
        this.position.y += (output + this.speed + this.wind.currentVelocity)//this.wind.currentVelocity + output);

        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y + this.height > this.gameHeight) this.position.y = this.gameHeight - this.height;
    }
}