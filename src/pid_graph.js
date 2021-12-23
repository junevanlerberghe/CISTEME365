export default class BarGraph{
    constructor(game, alpha = 1){
        //graphics
        const img = new Image();
        img.src = "assets/PID_graph_frame.PNG";
        this.image = img
        this.alpha = alpha;

        //sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 150;
        this.height = 250;

        //position
        this.position = {
            x: this.gameWidth - this.width,
            y: this.gameHeight - this.height
        };
        
    }
    update(dt){
        if (!dt) return;
    }

    draw(ctx){
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}