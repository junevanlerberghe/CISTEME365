//import GhostShip from "./ghost_ship";
//import BarGraph from "./pid_graph";

/*
I'm trying to get the bar of the bar graph to have a height that is dependent on the up component of the PID controller
in the ghost ship file
*/
export default class Bars{
    constructor(game, alpha = 1){
        //graphics
        const img = new Image();
        img.src = "assets/graph_bar.PNG";
        this.image = img;
        this.alpha = alpha;
        this.errors = [0];
        //sizing
        //this.BarGraphHeight = BarGraph.height
        //this.BarGraphWidth = BarGraph.width
        //let bar_graph_position = this.game.graph_frame.position
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 20;
        //10 for height is just a placeholder
        this.height = 10;

        //positioning
        this.position1 = {
            x: this.gameWidth - 125,
            y: this.gameHeight - 146
        }

    }
    
    /*
    currently the positioning is based on hard coded numbers. I was trying to based the positioning on the location
    of the frame of the bar graph.
    */
    findPosition(){
        let bar_graph_position = this.game.graph_frame.position;
        this.position.x = bar_graph_position.x
    }

    updateHeight(){
        let up = this.game.ghost_ship.up
        this.height = up*100
    }

    update(dt){
        if (!dt) return;
        //this.getPID()
        //this.findPosition()
        //this.updateHeight()
    }

    draw(ctx){
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.position1.x, this.position1.y, this.width, this.height)
    }
    getPID() {
        let obstacle1_position = this.game.obstacle_pair.position1;
        let obstacle2_position = this.game.obstacle_pair.position2;

        let target_pos_y = (obstacle1_position.y + obstacle2_position.y + this.game.obstacle_pair.height/2)/2;
        
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
        
    }
}