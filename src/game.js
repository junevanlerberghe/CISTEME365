import Ship from './ship.js'
import InputHandler from './input.js'
import ObstaclePair from './obstacle_pair.js';
import GhostShip from './ghost_ship.js'
import Wave from './wave.js'
import Wind from './wind.js'
import Difficulty from './difficulty.js'
import { GraphicsUtility } from "./graphics_utility.js";
import { LevelUtility } from "./level_utility.js";
import BarGraph from './pid_graph.js';
import Canal from "./Canal.js"
import Gates from './Gates.js';
import Bars from './graph_bars.js';

const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

const OBSTACLE_TYPE = {
    GLACIER: 0,
    ROCK: 1
};

export default class Game {

    constructor(gameWidth, gameHeight, gameDifficulty, ghostModeOn) {
        console.log("difficulty: " + gameDifficulty + ", ghost mode: " + ghostModeOn);

        // basic game information
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.ghostMode = ghostModeOn;

        // difficulty/level
        this.difficulty = Difficulty.getDifficulty(gameDifficulty);
        this.level = 1;
        this.nextLevelScore = this.level + LevelUtility.getFibonacci(this.level); // when score hits this #, level goes up
        this.currLevelScore = 0; // score needed to achieve this current level

        // properites
        this.lives = this.difficulty.lives;
        this.wind = this.difficulty.wind;
        this.goal = this.difficulty.goal;
        this.width = this.difficulty.width;
        this.speed = this.difficulty.speed;

        // stats to track for summary screen
        this.totalTime = 0;
        this.icebergCount = 0;

        // game objects (note wind is not a gameObject since it updates differently)
        this.ship = new Ship(this);
        this.ghost_ship = new GhostShip(this);
        this.obstacle_pair = new ObstaclePair(this, null, this.difficulty);
        this.wave = new Wave(this);
        this.wave2 = new Wave(this);
        this.wave3 = new Wave(this);
        this.gate = new Gates(this);
        this.graph_frame = new BarGraph(this);
        this.graph_bar = new Bars(this);
        this.gameObjects = [this.wave, this.wave2, this.wave3, this.ship, this.obstacle_pair];//, this.gate];

        // game state!
        this.gameState = GAMESTATE.RUNNING;
    }

    start() {
        new InputHandler(this.ship);
        if (this.ghostMode == "true") {
            this.gameObjects.push(this.ghost_ship);
            this.gameObjects.push(this.graph_frame);
            this.gameObjects.push(this.graph_bar);
        }
    }


    update(dt, timeStamp) {
        if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;

        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
        
        this.totalTime += dt/1000;

        this.updateLevel();
    }

    updateLevel() {
        // if score is enough for next level
        if (this.icebergCount === this.nextLevelScore) {
            // augment level number, reset number of icebergs needed to pass until next level
            this.level++;
            this.currLevelScore = this.nextLevelScore;
            this.nextLevelScore = this.level + LevelUtility.getFibonacci(this.level);
            console.log(this.nextLevelScore);

            // augment game variables to increase difficulty
            LevelUtility.augmentWind(this.level, this.wind);

            // set up so "Level x" effect shows on screen
            GraphicsUtility.newLevelEffectCount = GraphicsUtility.newLevelEffectDefaultLength;
        }
    }

    draw(ctx) {
        this.drawRunning(ctx);
        this.drawStats(ctx);
        
        // draw "Level x" as needed
        if (GraphicsUtility.newLevelEffectCount > 0) GraphicsUtility.drawNewLevelEffect(ctx, this);
        
        if(this.gameState === GAMESTATE.GAMEOVER) {
            // store data in local storage for summary page to access
            sessionStorage.setItem("totalTime", this.totalTime);
            sessionStorage.setItem("icebergCount", this.icebergCount);

            // draw game over window + button to move to summary page
            this.drawGameOverWindow(ctx);
        }
    }

    drawRunning(ctx) {
        // draw each item (boat, glaciers, waves)
        this.gameObjects.forEach(x => x.draw(ctx));
    }

    drawStats(ctx) {
        // draw stats that are all in a row in upper right corner
        let firstStatY = 60;
        let lineHeight = 30;
        let toWrite = [];
        // difficulty + level
        toWrite.push([this.difficulty.label + " Lvl: ", this.level]);
        // score (iceberg count)
        toWrite.push(["score:", this.icebergCount]);
        // lives
        toWrite.push(["lives:", this.lives]);
        // write em out
        for (let i = 0; i < toWrite.length; i++) {
            GraphicsUtility.drawStat(ctx, this, firstStatY + (lineHeight * i), toWrite[i][0], toWrite[i][1]);
        }

        // wind
        let windSpeedY = this.gameHeight / 2;
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity) * 100)/100;
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        GraphicsUtility.drawStat(ctx, this, windSpeedY - 30, "wind: ", ""); // draws: "wind:""
        GraphicsUtility.drawStat(ctx, this, windSpeedY, windSpeedText, windDirectionText); // draws: "x mph"

        let arrowXMargin = 130;
        let arrowLengthStretch = 100; // arrow will be drawn to length of windVelocity * this
        GraphicsUtility.drawArrow(ctx, this.gameWidth - arrowXMargin, this.gameHeight / 2,
            this.gameWidth - arrowXMargin, this.gameHeight / 2 + this.wind.currentVelocity * arrowLengthStretch);

        // level progress bar
        GraphicsUtility.drawLevelBar(ctx, this);
    }

    drawGameOverWindow(ctx) {
        // window
        ctx.rect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fill();

        // gmae over text
        GraphicsUtility.toGameHeaderFontStyle(ctx);
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);

        // button to summary page
        document.getElementById('summary').style.display = 'block';
        document.getElementById('summary').style.left = this.gameWidth/2 - 60;
        document.getElementById('summary').style.top = -280;
    }

    // helper methods
    generateObstacle() {
        return new ObstaclePair(this, OBSTACLE_TYPE.ROCK);
    }
}