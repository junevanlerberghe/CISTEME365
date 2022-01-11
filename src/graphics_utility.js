import { LevelUtility } from "./level_utility.js";

/**************************************************************
 * GRAPHICS UTILITY
 * ------------------------------------------------------------
 * utility class for various graphical needs (eg. font styles,
 * drawing specific shapes, etc.)
 **************************************************************/
export var GraphicsUtility = {
    /**********************************************************
     * fonts
     **********************************************************/
    drawTextList: function (ctx, textList, x, yInitial, lineSpacing) {
        for (let i = 0; i < textList.length; i++) {
            ctx.fillText(textList[i], x, yInitial + lineSpacing * i);
        }
    },
    toTitleFontStyle: function (ctx) {
        ctx.font = "55px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
    },
    toHeaderFontStyle: function (ctx) {
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
    },
    toBodyFontStyle: function (ctx) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
    },

    toGameHeaderFontStyle: function (ctx) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
    },

    /**********************************************************
     * basic drawing templates
     **********************************************************/
    drawStat: function (ctx, game, y, label, value) {
        // note: this function is specifically made for drawing stats (eg. lives, score, etc.)
        // during the game phase. as such, it may need adjusting to be used elsewhere

        const leftXMargin = 100; // left end of text will be at gameWidth - this
        const rightXMargin = 15; // right end of text will be at gameWidth - this
        this.toBodyFontStyle(ctx);
        ctx.fillText(label, game.gameWidth - leftXMargin, y);
        ctx.textAlign = "right";
        ctx.fillText(value, game.gameWidth - rightXMargin, y);
    },

    drawArrow: function (ctx, fromx, fromy, tox, toy){
        // from: https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
        const width = 5;
        const color = "rgba(0, 0, 0, 1)";
        var headlen = 15; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);

        //starting path of the arrow from the start square to the end square and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        
        //starting a new path from the head of the arrow to one of the sides of the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/5),toy-headlen*Math.sin(angle-Math.PI/5));
        
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/5),toy-headlen*Math.sin(angle+Math.PI/5));
        
        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/5),toy-headlen*Math.sin(angle-Math.PI/5));

        //draws the paths created above
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
    },

    newLevelEffectDefaultLength: 75, // default length for the new level text
    newLevelEffectCount: 75, // counter used to write text for correct length
    drawNewLevelEffect: function (ctx, game) {
        this.toTitleFontStyle(ctx);
        ctx.fillText("Level " + game.level, game.gameWidth / 2, game.gameHeight / 2);
        this.newLevelEffectCount--;
    },

    /**********************************************************
     * drawing level bar
     **********************************************************/
    // default stats
    levelBarX: 30, // default x start
    levelBarY: 15, // default y start
    levelBarDefaultWidth: 800 - 30 * 2, // dfeault width
    levelBarHeight: 10, // default height
    // draws the entire level bar (transparent total bar, opaque progress bar, and numerical stat)
    drawLevelBar: function (ctx, game) {
        this.drawLevelProgressBar(ctx, this.levelBarDefaultWidth, game);
        this.drawLevelTotalBar(ctx, this.levelBarDefaultWidth)
        this.drawLevelStats(ctx, game, this.levelBarDefaultWidth);
    },
    // this func draws a bar at the correct x, y, and height w/ options to change opacity and width
    drawLevelBarBaseFunction: function (ctx, opacity, width) {
        ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
        ctx.fillRect(this.levelBarX, this.levelBarY,
            width, this.levelBarHeight);
    },
    // draws opaque bar showing fractional progress towards next level
    drawLevelProgressBar: function (ctx, levelBarFullWidth, game) {
        let fractionCompleted = LevelUtility.getFractionOfLevelCompleted(game);
        this.drawLevelBarBaseFunction(ctx, 1, levelBarFullWidth * fractionCompleted);
    },
    // draws full-width transparent bar showing total needed to get to next level
    drawLevelTotalBar: function (ctx, width) {
        this.drawLevelBarBaseFunction(ctx, 0.5, width);
    },
    // draws numerical number showing how many icebergs need to be passed for next level (eg.: 1/2)
    drawLevelStats: function (ctx, game, totalBarWidth) {
        let text = (game.score - game.currLevelScore) + "/" + (game.nextLevelScore - game.currLevelScore);
        this.toBodyFontStyle(ctx);
        ctx.textAlign = "center";
        ctx.fillText(text, this.levelBarX + totalBarWidth / 2, this.levelBarY + this.levelBarHeight * 3);
    },
    // draws the word associated how the boat is in between the gap
    wordEffectCount: 40, //counter
    drawWord: function (ctx, game, scoreChange){
        this.toBodyFontStyle(ctx);
        var dict = {
            1: "Start!",
            0: "Hit!",
            8: "Good",
            9: "Great",
            10: "Perfect!"
        }
        ctx.fillText(dict[scoreChange], game.ship.position.x, game.ship.position.y);
        this.wordEffectCount--;
    }
}
        