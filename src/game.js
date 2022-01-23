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
import { ScoreHandler } from './score.js'

const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

const OBSTACLE_TYPE = {
    GLACIER: 0,
    ROCK: 1
};

export default class Game {

    constructor(gameWidth, gameHeight, gameDifficulty, playerType) {
        console.log("difficulty: " + gameDifficulty + ", player type: " + playerType);
        
        // basic game information
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.playerType = playerType;
        if(playerType != 0) { //0 is 1-player only (no ghost ship)
            this.ghostMode = true
        } else {
            this.ghostMode = false
        }
        
        // difficulty/level
        this.difficulty = Difficulty.getDifficulty(gameDifficulty);
        this.level = 1;
        this.obstaclesPassed = 0;
        this.nextLevelObstaclesPassed = this.obstaclesPassed + LevelUtility.getFibonacci(this.level); // when obstacles passed hits this #, level goes up
        this.currLevelObstaclesPassed = 0; // obstacles needed to pass to achieve this current level
        this.score = 0;
        this.scoreGhost = 0;

        // properties
        this.lives = this.difficulty.lives;
        this.wind = this.difficulty.wind;
        this.goal = this.difficulty.goal;
        this.width = this.difficulty.width;
        this.speed = this.difficulty.speed;

        // stats to track for summary screen
        this.totalTime = 0;

        // game objects (note wind is not a gameObject since it updates differently)
        this.ship = new Ship(this);
        this.ghost_ship = new GhostShip(this);
        this.obstacle_pair = new ObstaclePair(this, null, this.difficulty);
        this.wave = new Wave(this);
        this.wave2 = new Wave(this);
        this.wave3 = new Wave(this);
        this.pidGraph = new BarGraph(this);
        this.gameObjects = [this.wave, this.wave2, this.wave3, this.obstacle_pair];

        // game state!
        this.gameState = GAMESTATE.RUNNING;
    }

    start() {
        new InputHandler(this.ship);
        if (this.ghostMode == true) {
            this.gameObjects.push(this.ghost_ship);
            this.gameObjects.push(this.pidGraph);
        }
        if(this.playerType != 2) { //if it's not PID only, add the player ship
            this.gameObjects.push(this.ship);
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
        //let midpoint = 1
        //let positionShip = 1
        //this.score = Score.getShipPosition1(midpoint, positionShip, this.score);

        //if enough obstacles have been passed to reach next level
        if (this.obstaclesPassed === this.nextLevelObstaclesPassed) {
            // augment level number, reset number of obstacles needed to pass until next level
            this.level++;
            this.currLevelObstaclesPassed = this.nextLevelObstaclesPassed;
            this.nextLevelObstaclesPassed = this.obstaclesPassed + LevelUtility.getFibonacci(this.level);
            // console.log(this.nextLevelObstaclesPassed);

            // augment game variables to increase difficulty
            LevelUtility.augmentWind(this.level, this.wind, this.difficulty);

            // set up so "Level x" effect shows on screen
            GraphicsUtility.newLevelEffectCount = GraphicsUtility.newLevelEffectDefaultLength;
        }
    }

    draw(ctx) {
        this.drawRunning(ctx);
        this.drawStats(ctx);
        this.drawPopupEffects(ctx);
        
        if(this.gameState === GAMESTATE.GAMEOVER) {
            // store data in local storage for summary page to access
            sessionStorage.setItem("totalTime", this.totalTime);
            sessionStorage.setItem("obstaclesPassed", this.obstaclesPassed);
            sessionStorage.setItem("level", this.level);
            sessionStorage.setItem("pidHistory", this.ghost_ship.historicPID);
            sessionStorage.setItem("score", ScoreHandler.score);
            sessionStorage.setItem("scoreGhost", ScoreHandler.ghostScore); //to be used in comparison bar graph in summary page

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
        // obstacles passed
        toWrite.push(["obstacles:", this.obstaclesPassed]);
        // lives
        toWrite.push(["lives:", this.lives]);
        // score (new)
        toWrite.push(["score:", ScoreHandler.score]);
        // score (ghost)
        //let trouble = this.gameObjects.Contains(this.ghost_ship);
        if (this.gameObjects.indexOf(this.ghost_ship) > 0){
            toWrite.push(["ghost:", ScoreHandler.ghostScore]);
        };
        // write em out
        for (let i = 0; i < toWrite.length; i++) {
            GraphicsUtility.drawStat(ctx, this, firstStatY + (lineHeight * i), toWrite[i][0], toWrite[i][1]);
        }

        // wind
        let windSpeedY = this.gameHeight*(2/5);
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity) * 100)/100;
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        GraphicsUtility.drawStat(ctx, this, windSpeedY - 30, "wind: ", ""); // draws: "wind:""
        GraphicsUtility.drawStat(ctx, this, windSpeedY, windSpeedText, windDirectionText); // draws: "x mph"

        let arrowXMargin = 130;
        let arrowLengthStretch = 100; // arrow will be drawn to length of windVelocity * this
        GraphicsUtility.drawArrow(ctx, this.gameWidth - arrowXMargin, this.gameHeight*(2/5),
            this.gameWidth - arrowXMargin, this.gameHeight*(2/5) + this.wind.currentVelocity * arrowLengthStretch);

        // level progress bar
        GraphicsUtility.drawLevelBar(ctx, this);
    }

    drawPopupEffects(ctx) {
        // draw "Level x" as needed
        if (GraphicsUtility.newLevelEffectCount > 0) GraphicsUtility.drawNewLevelEffect(ctx, this);

        // draw the score popup (e.g. "Perfect!" or "Hit!")
        if (GraphicsUtility.wordEffectCount > 0) GraphicsUtility.drawScoreWord(ctx, ScoreHandler.scoreChange, this.ship);
        if (GraphicsUtility.wordEffectCount > 0 && this.ghostMode) GraphicsUtility.drawScoreWord(ctx, ScoreHandler.ghostScoreChange, this.ghost_ship);
    }


    drawGameOverWindow(ctx) {
        // window
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);

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