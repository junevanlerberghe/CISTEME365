import { GraphicsUtility } from "./graphics_utility.js";
import Difficulty from "./difficulty.js";

export default class Summary {
    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;

        this.graph = {
            x: 250,
            y: 250,
            width: 500,
            height: 300,
            axisY: 250 + 300 / 2, // y of xAxis relative to upper left
            yScale: 0.05, // play around with this
            
            lineColors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"]
        };
        this.graphKey = {
            x: this.graph.x - 57,
            y: this.graph.y,
            width: 50,
            height: 80,
            padding: 8,

            iconWidth: 15,
            iconTextDistance: 4,

            text: ["P", "I", "D"]
        };
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
                        `Obstacles dodged: ${sessionStorage.getItem("obstaclesPassed")}`,
                        `Score: ${sessionStorage.getItem("score")}`
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
        this.drawGraphBox(ctx);
        this.drawGraphKey(ctx);

        // get the pidHistory
        const pidHistory = this.parsePIDHistory(sessionStorage.getItem("pidHistory"));
        const xIncrement = this.graph.width / pidHistory.length; // pixels between two data points in graph in x-axis
        
        // for each of P, I, and D
        for (let pidIndex = 0; pidIndex < 3; pidIndex++) {
            // begin drawing hte line graph at the y value of the first data point
            ctx.beginPath();
            ctx.moveTo(this.graph.x, this.findGraphBoundedY(pidHistory[0][1]));
            
            // for each data point
            for (let i = 1; i < pidHistory.length; i++) { // we started at first value, so iterate from i = 1
                ctx.lineTo(this.graph.x + xIncrement * i, this.findGraphBoundedY(pidHistory[i][pidIndex]));
            }
            ctx.strokeStyle = this.graph.lineColors[pidIndex];
            ctx.stroke();
            // consider: are negative values being drawn upwards right now ?
        }
    }

    drawGraphBox(ctx) {
        // draw box
        ctx.strokeRect(this.graph.x, this.graph.y, this.graph.width, this.graph.height);
        
        // draw axis
        ctx.beginPath();
        ctx.moveTo(this.graph.x, this.graph.axisY);
        ctx.lineTo(this.graph.x + this.graph.width, this.graph.axisY);
        ctx.stroke();
    }

    drawGraphKey(ctx) {
        // set up font style
        GraphicsUtility.toBodyFontStyle(ctx);
        ctx.textBaseline = "middle";

        // constants
        const iconX = this.graphKey.x + this.graphKey.padding;
        const startingY = this.graphKey.y + this.graphKey.padding;
        const lineHeight = this.graphKey.iconWidth + (this.graphKey.height - 2 * this.graphKey.padding - 3 * this.graphKey.iconWidth) / (this.graphKey.text.length - 1);

        // draw surrounding box rectangle
        ctx.strokeRect(this.graphKey.x, this.graphKey.y, this.graphKey.width, this.graphKey.height);

        // draw each of P, I, and D
        for (let i = 0; i < 3; i++) {
            let currentY = startingY + lineHeight * i;
            
            ctx.fillStyle = this.graph.lineColors[i];
            ctx.fillRect(iconX, currentY, this.graphKey.iconWidth, this.graphKey.iconWidth);
            ctx.fillStyle = "#000000";
            ctx.fillText(this.graphKey.text[i],
                iconX + this.graphKey.iconWidth + this.graphKey.iconTextDistance,
                currentY + this.graphKey.iconWidth / 2);
        }


        this.graphKey = {
            x: 0,
            y: 0,
            width: 50,
            height: 100,
            padding: 5
        };
    }

    findGraphBoundedY(pidValue) {
        let unboundedValue = this.graph.axisY + pidValue * this.graph.yScale;
        if (unboundedValue < this.graph.y) return this.graph.y;
        if (unboundedValue > this.graph.y + this.graph.height) return this.graph.y + this.graph.height;
        return unboundedValue;
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