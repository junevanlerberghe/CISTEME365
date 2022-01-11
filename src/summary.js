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
        ctx.fillText("Stats", 10, 130);

        GraphicsUtility.toBodyFontStyle(ctx);
        let textList = [`Level: ${Difficulty.getDifficulty(sessionStorage.getItem("difficulty")).label} ${sessionStorage.getItem("level")}`,
                        `Time: ${this.parseTime(2)}`,
                        `Obstacles dodged: ${sessionStorage.getItem("score")}`,
                        `Score: ${sessionStorage.getItem("score1")}`
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

    
    // note: this very well could be completely broken lol
    // consider: have summary screen on same page as game?
    drawPIDGraph(ctx) {
        // visual properties of graph
        const graphX = 250;
        const graphY = 250;
        const graphWidth = 500;
        const graphHeight = 300;
        ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

        // get the pidHistory
        const pidHistory = this.parsePIDHistory(sessionStorage.getItem("pidHistory"));
        const xIncrement = graphWidth / pidHistory.length; // pixels between two data points in graph in x-axis
        const yScale = 0.01; // y-scale to fit data within the graph; fix this later
        const lineColors = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
        
        // for each of P, I, and D
        for (let pidIndex = 0; pidIndex < 3; pidIndex++) {
            // begin drawing hte line graph at the y value of the first data point
            ctx.beginPath();
            ctx.moveTo(graphX, graphY + yScale * pidHistory[0][1]);
            
            // for each data point
            for (let i = 1; i < pidHistory.length; i++) { // we started at first value, so iterate from i = 1
                ctx.lineTo(graphX + xIncrement * i, graphY + pidHistory[i][pidIndex] * yScale);
            }
            ctx.strokeStyle = lineColors[pidIndex];
            ctx.stroke();
            // consider: are negative values being drawn upwards right now ?
        }
        

        
    }

    parsePIDHistory(pidHistory) {
        let pidHistorySplit = pidHistory.split(',');

        console.log(pidHistorySplit);
        let twoDimensionalPIDHistory = [[]];

        // group every 3 values in pidHistorySplit into an array to create a 2D array
        for (let i = 1; i < pidHistorySplit.length; i += 3) { // start at i=1 bc first value in PID History is blank
            twoDimensionalPIDHistory.push([parseInt(pidHistorySplit[i]),
                parseInt(pidHistorySplit[i + 1]), parseInt(pidHistorySplit[i + 2])]);
        }
        return twoDimensionalPIDHistory;
    }

    drawHomeButton(ctx) {
        // button to index page
        document.getElementById('indexButton').style.display = "block";
        document.getElementById('indexButton').style.left = this.gameWidth/2 - 60;
        document.getElementById('indexButton').style.top = -280;
    }
}