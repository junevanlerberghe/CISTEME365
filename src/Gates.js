export default class Gates {
    constructor(game) {
        // sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;

        // Set the width of gates
        this.gate_width = 70;

        // Set the speed of ship wrt gates
        this.speed = 3;

        this.width1 = 20;
        this.height1 = -1000;
        this.x1 = 900;
        this.y1 = 300;

        this.width2 = 20;
        this.height2 = -1000;
        this.x2 = this.x1 + 600;
        this.y2 = 300;

  
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.fillRect(this.x1, this.y1, this.width1, this.height1);
        ctx.fillRect(this.x1, this.y1 + this.gate_width, this.width1, -this.height1);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillRect(this.x2, this.y2, this.width2, this.height2);
        ctx.fillRect(this.x2, this.y2 + this.gate_width, this.width2, -this.height2);
        ctx.stroke();
    }

    update(dt) {
        if (!dt) {
            return;
        }
        if (this.x1 < 0 && this.x2 < 0) {
            this.x1 = 910;
            this.x2 = this.x1 + 600;
            this.y1 = Math.floor((Math.random() * 400) + 200);
            this.y2 = Math.floor((Math.random() * 400) + 200);
        }
        this.x1 -= this.speed;

        this.x2 -= this.speed;

    }
}