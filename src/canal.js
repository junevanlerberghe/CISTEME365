export default class Canal {
    constructor(game) {
        this.startx =  0;
        this.starty =  300;
        this.cp1x =  300;
        this.cp1y =  100;
        this.cp2x =  600;
        this.cp2y =  500;
        this.endx = 800;
        this.endy =  400;

        this.game = game;

        this.cp1x2 = this.endx + 300;
        if (this.endy - this.cp1y < 0) {
            this.cp1y2 = this.starty2 - 50;
        } else {
            this.cp1y2 = this.starty2 + 50;
        }
        this.cp2x2 =  this.endx + 600;
        this.cp2y2 =  400;
        this.endx2 =  this.endx + 800;
        this.endy2 =  100;

  
        this.cp1x3 = this.endx2 + 300;
        if (this.endy2 - this.cp1y2 < 0) {
            this.cp1y3 = this.endy3 - 50;       
        } else {
            this.cp1y3 = this.endy2 + 50;
        }
        this.cp2x3 = this.endx2 + 600;
        this.cp2y3 = 100;
        this.endx3 = this.endx2 + 800;
        this.endy3 = 400;


        this.cp1x4 = this.endx3 + 300;
        if (this.endy3 - this.cp1y3 < 0) {
            this.cp1y4 = this.endy3 - 50;
        } else {
            this.cp1y4 = this.endy3 + 50;
        }
        this.cp2x4 = this.endx3 + 600;
        this.cp2y4 = 300;
        this.endx4 = this.endx3 + 800;
        this.endy4 = 250;
    }
    draw(ctx) {

        ctx.beginPath();
        // ctx.beginPath();
        ctx.moveTo(this.startx, this.starty);

        ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.endx, this.endy);
        

        ctx.bezierCurveTo(this.cp1x2, this.cp1y2,this.cp2x2, this.cp2y2, this.endx2, this.endy2);
        


        ctx.bezierCurveTo(this.cp1x3, this.cp1y3, this.cp2x3, this.cp2y3, this.endx3, this.endy3);
        

        ctx.bezierCurveTo(this.cp1x4, this.cp1y4, this.cp2x4,  this.cp2y4, this.endx4, this.endy4);
        //ctx.fillStyle = "#000000";
        //ctx.fill();
        ctx.stroke();


        // ctx.beginPath();
        ctx.moveTo(this.startx, this.starty + 30);
        ctx.bezierCurveTo(this.cp1x, this.cp1y + 80, this.cp2x, this.cp2y + 80, this.endx, this.endy + 80);
        ctx.bezierCurveTo(this.cp1x2, this.cp1y2 + 80,this.cp2x2, this.cp2y2 + 80, this.endx2, this.endy2 + 80);
        ctx.bezierCurveTo(this.cp1x3, this.cp1y3 + 80, this.cp2x3, this.cp2y3 + 80, this.endx3, this.endy3 + 80);
        ctx.bezierCurveTo(this.cp1x4, this.cp1y4 + 80, this.cp2x4,  this.cp2y4 + 80, this.endx4, this.endy4 + 80);

        ctx.stroke();

        ctx.moveTo(2, 0);
        ctx.lineTo(2, 650);
        // ctx.fillStyle = "#00a780";
        // ctx.fill();
        ctx.stroke();

 

        // ctx.beginPath();
        // ctx.moveTo(600, 0);
        // ctx.lineTo(600, 650);

        // ctx.stroke();

        ctx.moveTo(0, 550);
        ctx.lineTo(900, 550);

        ctx.stroke();      
    }
    //we could explore creating two different sin waves on top of each other to represent the canal
    /*
    plotSine1(ctx) { 
        let height = this.game.gameHeight;
        let width = this.game.gameWidth;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(66,44,255)";
        
        var x = 0;
        var y = 0;
        var amplitude = 40;
        var frequency = 60;
        ctx.moveTo(x, y);
        while (x < width) {
            y = height/2 + amplitude * Math.sin(x/frequency);
            ctx.lineTo(x, y);
            x = x + 1;
            console.log(y)
        }
        ctx.stroke();
    }
    plotSine2(ctx) { 
        let height = this.game.gameHeight;
        let width = this.game.gameWidth;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(66,44,255)";
        
        var x = 0;
        var y = 100;
        var amplitude = 100;
        var frequency = 80;
        ctx.moveTo(x, y);
        while (x < width) {
            y = height/2 + amplitude * Math.sin(x/frequency);
            ctx.lineTo(x, y);
            x = x + 1;
            console.log(y)
        }
        ctx.stroke();
    }
    draw(ctx) {
        ctx.clearRect(0, 0, 500, 500);
        this.plotSine1(ctx);
        this.plotSine2(ctx);

    }
    */

    update(dt, ctx) {
        if(!dt) return;
            this.startx -= 5;
            this.cp1x -= 5;
            this.cp2x -= 5;
            this.endx -= 5;

            this.cp1x2 -= 5;
            this.cp2x2 -= 5;
            this.endx2 -= 5;
           
            this.cp1x3 -= 5;
            this.cp2x3 -= 5;
            this.endx3 -= 5;

            this.cp1x4 -= 5;
            this.cp2x4 -= 5;
            this.endx4 -= 5;
    }

}