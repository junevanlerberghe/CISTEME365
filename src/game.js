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
    RUNNING: 1,
    PAUSED: 2,
    START: 3
};

const OBSTACLE_TYPE = {
    GLACIER: 0,
    ROCK: 1
};

export default class Game {

    constructor(gameWidth, gameHeight, gameDifficulty, playerType, windType) {
        console.log("difficulty: " + gameDifficulty + ", player type: " + playerType);
        console.log("windType" + windType)
        // basic game information
        const GAMESTATE = {
            GAMEOVER: 0,
            RUNNING: 1,
            PAUSED: 2,
            START: 3
        };
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.playerType = playerType;
        if(playerType != 0) { //0 is 1-player only (no ghost ship)
            this.ghostMode = true
            
        } else {
            this.ghostMode = false
        }
        if(playerType != 2) { //2 is ghost ship only (no player)
            this.playerMode = true
        } else {
            this.playerMode = false
        }

        // difficulty/wind
        this.windType = parseInt(sessionStorage.getItem("windType"));
        this.difficulty = Difficulty.getDifficulty(gameDifficulty, windType);
        
        this.wind = this.difficulty.wind;

        // level/score
        this.level = 1;
        this.obstaclesPassed = 0;
        this.nextLevelObstaclesPassed = this.obstaclesPassed + LevelUtility.getFibonacci(this.level); // when obstacles passed hits this #, level goes up
        this.currLevelObstaclesPassed = 0; // obstacles needed to pass to achieve this current level
        this.score = 0;
        this.scoreGhost = 0;

        this.velocityConstant = 1;//0.1; // multiples all velocities in game

        // properties
        this.lives = this.difficulty.lives;
        this.goal = this.difficulty.goal;
        this.width = this.difficulty.width;
        this.speed = this.difficulty.speed;

        // stats to track for summary screen
        this.totalTime = 0;
        this.frameCount = 0;

        // game objects (note wind is not a gameObject since it updates differently)
        this.ship = new Ship(this);
        this.ghost_ship = new GhostShip(this);
        this.obstacle_pair = new ObstaclePair(this, null, this.difficulty);
        this.wave = new Wave(this,this.difficulty);
        this.wave2 = new Wave(this, this.difficulty);
        this.wave3 = new Wave(this, this.difficulty);
        this.pidGraph = new BarGraph(this);
        this.gameObjects = [this.wave, this.wave2, this.wave3, this.obstacle_pair];

        // game state!
        this.gameState = GAMESTATE.START;
        this.pauseClickState = 0;

        //wave info
        this.waveSavedSpeed = this.wave.speed;
        this.waveSavedSpeed2 = this.wave2.speed;
        this.waveSavedSpeed3 = this.wave3.speed;
    }

    start() {
        new InputHandler(this.ship, this);
        if (this.ghostMode == true) {
            this.gameObjects.push(this.ghost_ship);
            this.gameObjects.push(this.pidGraph);
        }
        if(this.playerType != 2) { //if it's not PID only, add the player ship
            this.gameObjects.push(this.ship);
        }
    }

    setDT(dt) {
        this.frames = Math.floor(dt/16);
        if(this.frames == 0) {
            this.fastFrames = Math.floor(dt/5);
        }
    }

    update(dt, timeStamp) {
        /*
        //this.startGame();             began working moving everything to one page
        if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;
        //There are many checkPauseButtons() functions. I think when the game is at certain parts of the loop, the function checkPauseButton()
        //isn't read so the button click isn't always registered.
        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
        this.totalTime += dt/1000;  

        var sliderd = document.getElementById("dval");
        var slideri = document.getElementById("ival");
        var sliderp = document.getElementById("pval");
        sessionStorage.setItem("pSlider", sliderp.textContent)
        sessionStorage.setItem("iSlider", slideri.textContent)
        sessionStorage.setItem("dSlider", sliderd.textContent)

        this.updateLevel();
        */

        //if the computer is slower, update frames more frequently
        for(let i = 0; i < this.frames; i++) {
            //this.startGame();             began working moving everything to one page
            if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
            if(this.gameState === GAMESTATE.GAMEOVER) return;
            //There are many checkPauseButtons() functions. I think when the game is at certain parts of the loop, the function checkPauseButton()
            //isn't read so the button click isn't always registered.
            this.wind.update(timeStamp);
            //this.gameObjects.forEach(x => x.update(dt));
            //these objects are updated inside the loop since they need to be moving faster
            this.wave.update(dt)
            this.wave2.update(dt)
            this.wave3.update(dt)
            this.obstacle_pair.update(dt)
            if (this.ghostMode == true) {
                this.pidGraph.update(dt)
            }
            
            this.totalTime += dt/1000;  

            var sliderd = document.getElementById("dval");
            var slideri = document.getElementById("ival");
            var sliderp = document.getElementById("pval");
            sessionStorage.setItem("pSlider", sliderp.textContent)
            sessionStorage.setItem("iSlider", slideri.textContent)
            sessionStorage.setItem("dSlider", sliderd.textContent)

            this.updateLevel();
        }
        //ships should not move faster, so they are updated only once each loop
        if (this.ghostMode == true) {
            this.ghost_ship.update(dt)
        }
        if(this.playerType != 2) {
            this.ship.update(dt)
        }
        
    }

    input(dt){
        this.checkPauseButton();
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
            this.saveGameStats()

            // draw game over window + button to move to summary page
            this.drawGameOverWindow(ctx);
        }

        if(this.gameState === GAMESTATE.PAUSED) {
            this.drawPausedWindow(ctx);
        }

        if(this.gameState === GAMESTATE.START) {
            //this.drawStartWindow(ctx);
            this.drawFirstAlertWindow(ctx);
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
        if (this.gameObjects.indexOf(this.ship) > 0){
            toWrite.push(["score:", ScoreHandler.score]);
        }
        // score (ghost)
        if (this.gameObjects.indexOf(this.ghost_ship) > 0){
            toWrite.push(["ghost:", ScoreHandler.ghostScore]);
        };
        // write em out
        for (let i = 0; i < toWrite.length; i++) {
            GraphicsUtility.drawStat(ctx, this, firstStatY + (lineHeight * i), toWrite[i][0], toWrite[i][1]);
        }

        // wind
        let windSpeedY = this.gameHeight*(1/2);
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity )*100)/5; // 20 is scalar multiplier
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        GraphicsUtility.drawStat(ctx, this, windSpeedY - 30, "wind: ", ""); // draws: "wind:""
        GraphicsUtility.drawStat(ctx, this, windSpeedY, windSpeedText, windDirectionText); // draws: "x mph"

        let arrowXMargin = 130;
        let arrowLengthStretch = 100; // arrow will be drawn to length of windVelocity * this
        GraphicsUtility.drawArrow(ctx, this.gameWidth - arrowXMargin, this.gameHeight*(1/2),
            this.gameWidth - arrowXMargin, this.gameHeight*(1/2) + this.wind.currentVelocity * arrowLengthStretch);

        // level progress bar
        GraphicsUtility.drawLevelBar(ctx, this);
    }

    drawPopupEffects(ctx) {
        // draw "Level x" as needed
        if (GraphicsUtility.newLevelEffectCount > 0) GraphicsUtility.drawNewLevelEffect(ctx, this);

        // draw the score popup (e.g. "Perfect!" or "Hit!")
        if (GraphicsUtility.wordEffectCount > 0 && this.playerMode) GraphicsUtility.drawScoreWord(ctx, ScoreHandler.scoreChange, this.ship);
        if (GraphicsUtility.wordEffectCount > 0 && this.ghostMode) GraphicsUtility.drawScoreWord(ctx, ScoreHandler.ghostScoreChange, this.ghost_ship);
    }

    pauseGame() {
        this.gameState = GAMESTATE.PAUSED;
        this.ship.updateMovementConst = false;
        this.ghost_ship.updateMovementConst = false;
        this.obstacle_pair.speed = 0;
        this.waveSavedSpeed = this.wave.speed;
        this.wave.speed = 0;
        this.waveSavedSpeed2 = this.wave2.speed;
        this.wave2.speed = 0;
        this.waveSavedSpeed3 = this.wave3.speed;
        this.wave3.speed = 0;
    }

    resumeGame() {
        this.gameState = GAMESTATE.RUNNING;
        this.ship.updateMovementConst = true;
        this.ghost_ship.updateMovementConst = true;
        this.obstacle_pair.speed = this.speed;
        this.wave.speed = this.waveSavedSpeed;
        this.wave2.speed = this.waveSavedSpeed2;
        this.wave3.speed = this.waveSavedSpeed3;
        document.getElementById('summary').style.display = 'none';
    }

    startGame() {
        this.gameState = GAMESTATE.START;
        this.ship.updateMovementConst = false;
        this.ghost_ship.updateMovementConst = false;
        this.obstacle_pair.speed = 0;
        this.waveSavedSpeed = this.wave.speed;
        this.wave.speed = 0;
        this.waveSavedSpeed2 = this.wave2.speed;
        this.wave2.speed = 0;
        this.waveSavedSpeed3 = this.wave3.speed;
        this.wave3.speed = 0;
    }

    drawPausedWindow(ctx) {
        // window
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);

        // game over text
        GraphicsUtility.toGameHeaderFontStyle(ctx);
        ctx.fillText("GAME PAUSED", this.gameWidth / 2, 2 * this.gameHeight / 5);
        GraphicsUtility.toGameBodyFontStyle(ctx);
        ctx.fillText("Press Resume to unpause, or See Results to end game", this.gameWidth / 2, 2 * this.gameHeight / 5 + 20);

        // save game stats
        this.saveGameStats()

        // button to summary page
        document.getElementById('summary').style.display = 'block';
        document.getElementById('summary').style.left = this.gameWidth/2 - 60;
        document.getElementById('summary').style.top = -280;

        /* tried to add continue button to paused screen, but I couldn't figure out how to resume the game
        //button to continue
        document.getElementById('continue').style.display = 'block';
        document.getElementById('continue').style.left = this.gameWidth/2 - 130;
        document.getElementById('continue').style.top = -355;

        document.getElementById('continue').onclick = continueButton();

        function continueButton() {
            let state = GAMESTATE.RUNNING;
            console.log('running')
        }
        */
    }

    drawFirstAlertWindow(ctx) {
        this.ship.updateMovementConst = false;
        this.ghost_ship.updateMovementConst = false;
        this.obstacle_pair.speed = 0;
        this.waveSavedSpeed = this.wave.speed;
        this.wave.speed = 0;
        this.waveSavedSpeed2 = this.wave2.speed;
        this.wave2.speed = 0;
        this.waveSavedSpeed3 = this.wave3.speed;
        this.wave3.speed = 0;

        // window
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);

        // game over text
        GraphicsUtility.toGameBodyFontStyle(ctx);
        ctx.fillText("Please first click the full screen button", this.gameWidth / 2, 2 * this.gameHeight / 5);
        ctx.fillText("on the side of the game to go into full screen!", this.gameWidth / 2, 2 * this.gameHeight / 5 + 20);
        document.getElementById('okay').visibility = 'visible'
        document.getElementById('okay').style.left = this.gameWidth/2 - 60;
        document.getElementById('okay').style.top = -280
       
        if(document.getElementById('okay').value == 'true') {
            document.getElementById('okay').hidden = true
            this.resumeGame();
        }
        
    }

    drawStartWindow(ctx) {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);
        GraphicsUtility.toGameHeaderFontStyle(ctx);
        ctx.fillText("Page", this.gameWidth/2, this.gameHeight/2);
        GraphicsUtility.toGameBodyFontStyle(ctx);
        ctx.fillText("[Insert Game Info]", this.gameWidth/2, this.gameHeight/2 +20);
        document.getElementById('start').style.display = 'block';
        document.getElementById('start').style.left = this.gameWidth/2 - 60;
        document.getElementById('start').style.top = -280
    }

    drawGameOverWindow(ctx) {
        // window
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);

        // game over text
        GraphicsUtility.toGameHeaderFontStyle(ctx);
        ctx.fillText("GAME OVER", this.gameWidth / 2, 2 * this.gameHeight / 5);

        // button to summary page
        // document.getElementById('summary').style.display = 'block';
        // document.getElementById('summary').style.left = this.gameWidth/2 - 60;
        // document.getElementById('summary').style.top = -280;
        //GraphicsUtility.drawButton(ctx, this, "See Results");

        document.getElementById('summary').style.display = 'block';
        document.getElementById('summary').style.left = this.gameWidth/2 - 60;
        document.getElementById('summary').style.top = -280;
    }

    // helper methods
    generateObstacle() {
        return new ObstaclePair(this, OBSTACLE_TYPE.ROCK);
    }  

    
    checkPauseButton() {
        /*trying to fix pause button again 
        if(document.getElementById('pause').value % 2 == 0) {
            this.resumeGame();
            document.getElementById('pause').innerHTML="Pause"
        } else {
            this.pauseGame();
            document.getElementById('pause').innerHTML="Resume"
        }
        */
        document.getElementById('pause').addEventListener('click', button=>{
            this.pauseClickState += 1
            if (this.pauseClickState % 2 == 0){
            this.pauseGame();
            document.getElementById('pause').innerHTML="Resume"
            }else{
            this.resumeGame();
            document.getElementById('pause').innerHTML="Pause"
            }
        })
        
    }

    /*
    checkPauseButton() {
        document.getElementById('pause').addEventListener('click', button=>{
            this.pauseClickState *= -1
            console.log(this.pauseClickState)
            if (this.pauseClickState < 0) {
                this.pauseGame();
                document.getElementById('pause').innerHTML="Resume"
            } else {
                this.resumeGame();
                document.getElementById('pause').innerHTML="Pause"
            }
        })
    }
    */

    saveGameStats(){
        sessionStorage.setItem("totalTime", this.totalTime);
            sessionStorage.setItem("obstaclesPassed", this.obstaclesPassed);
            sessionStorage.setItem("level", this.level);
            sessionStorage.setItem("pidHistory", this.ghost_ship.historicPID);
            if (this.playerMode){
                sessionStorage.setItem("score", ScoreHandler.score);
            } else {
                sessionStorage.setItem("score", "N/A");
            }
            if (this.ghostMode){
                sessionStorage.setItem("scoreGhost", ScoreHandler.ghostScore); //to be used in comparison bar graph in summary page
            } else {
                sessionStorage.setItem("scoreGhost", "N/A");
            }
    }
}