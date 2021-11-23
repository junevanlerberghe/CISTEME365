export var FontStyles = {
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
    }
}