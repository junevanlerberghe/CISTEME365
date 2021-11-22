import Game from './game.js'

export default class Summary {
    constructor(gameWidth, gameHeight, game) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.game = game;
    }
    
    start() {
        document.getElementById('indexButton').style.display = 'none';
    }


    draw(ctx) {
        this.drawBasicStats(ctx);
        this.drawPIDGraph(ctx);
    }

    drawBasicStats(ctx) {
        this.toTitleFontStyle(ctx);
        ctx.fillText("Summary", this.gameWidth / 2, 80);

        this.toHeaderFontStyle(ctx);
        ctx.fillText("General Overview", 10, 130);

        this.toBodyFontStyle(ctx);

        // experimentation; fix later
        let textList = [`Time: ${this.game.totalTime}`, `Icebergs dodged: ${this.game.icebergCount}`, "Total miles traversed: "]
        this.drawTextList(ctx, textList, 10, 170, 30);
    }


    drawTextList(ctx, textList, x, yInitial, lineSpacing) {
        for (let i = 0; i < textList.length; i++) {
            ctx.fillText(textList[i], x, yInitial + lineSpacing * i);
        }
    }
    toTitleFontStyle(ctx) {
        ctx.font = "55px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
    }
    toHeaderFontStyle(ctx) {
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
    }
    toBodyFontStyle(ctx) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
    }



    
    
    drawPIDGraph(ctx) {
        // todo
    }
}