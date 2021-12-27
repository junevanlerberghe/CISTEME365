import { GraphicsUtility } from "./graphics_utility.js";
import Difficulty from "./difficulty.js";

export default class Summary {
    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
    }
    
    start() {
    }

    draw(ctx) {
        this.drawBasicStats(ctx);
        this.drawPIDGraph(ctx);
        this.drawHomeButton(ctx);
    }

    drawBasicStats(ctx) {
        GraphicsUtility.toTitleFontStyle(ctx);
        ctx.fillText("Summary", this.gameWidth / 2, 80);

        GraphicsUtility.toHeaderFontStyle(ctx);
        ctx.fillText("General Overview", 10, 130);

        GraphicsUtility.toBodyFontStyle(ctx);
        let textList = [`Level: ${Difficulty.getDifficulty(sessionStorage.getItem("difficulty")).label} ${sessionStorage.getItem("level")}`,
                        `Time: ${this.parseTime(2)}`,
                        `Obstacles dodged: ${sessionStorage.getItem("score")}`,
                        ]
        GraphicsUtility.drawTextList(ctx, textList, 10, 170, 30);
    }


    

    parseTime(digitsAfterDecimal) {
        digitsAfterDecimal = 3;
        let rawTimeStr = sessionStorage.getItem("totalTime");
        let strSplit = rawTimeStr.split('.');

        // rounds x places after hte decimal point (adds 0's to end if needed)
        if (strSplit.length == 1) {
            return strSplit[0] + "." + "0".repeat(digitsAfterDecimal);
        } else {
            return strSplit[0] + "." + (strSplit[1].length >= digitsAfterDecimal ?
                                        strSplit[1].substr(0, digitsAfterDecimal) :
                                        strSplit[1] + "0".repeat(digitsAfterDecimal - strSplit[1].length));
        }
    }

    
    
    drawPIDGraph(ctx) {
        const graphX = 250;
        const graphY = 250;
        const graphWidth = 500;
        const graphHeight = 300;

        // graph outline
        ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

        const pidHistory = sessionStorage.getItem("pidHistory");
        console.log(pidHistory[1]);
        const xIncrement = graphWidth / pidHistory.length; // pixels between two data points in graph in x-axis
        const yScale = 10000; // fix this later

        ctx.moveTo(graphX, yScale * pidHistory[0][1]);
        
        for (let i = 1; i < pidHistory.length; i++) { // start at the second value
            ctx.lineTo(xIncrement * i, pidHistory[i][1] * yScale);
        }

        ctx.stroke();



    }

    drawHomeButton(ctx) {
        // button to index page
        document.getElementById('indexButton').style.display = "block";
        document.getElementById('indexButton').style.left = this.gameWidth/2 - 60;
        document.getElementById('indexButton').style.top = -280;
    }
}