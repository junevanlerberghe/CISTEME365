/**************************************************************
 * GRAPHICS UTILITY
 * ------------------------------------------------------------
 * utility class for various graphical needs (eg. font styles,
 * drawing specific shapes, etc.)
 **************************************************************/
export var GraphicsUtility = {
    // fonts
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

    // drawing
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
        const color = "#000000";
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
    }
}