import Bars from "./graph_bars.js";

export default class BarGraph{
    constructor(game){
        //graphics
        const img = new Image();
        img.src = "assets/PID_graph_frame_resized.png";
        this.image = img;

        //sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 184 * 0.7;
        this.height = 251 * 0.7;
        this.graphHeight = 170 * this.height / 251;

        //position
        this.position = {
            x: this.gameWidth - this.width,
            y: this.gameHeight - this.height
        };

        // bars
        this.bars = new Bars(game, this);
        
    }
    update(dt){
        if (!dt) return;
        this.bars.update(dt);
    }

    draw(ctx){
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        this.bars.draw(ctx);
    }
}
