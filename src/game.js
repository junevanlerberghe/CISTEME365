import Ship from './ship.js'
import InputHandler from './input.js'
import ObstaclePair from './obstacle_pair.js';
import GhostShip from './ghost_ship.js'
import Wave from './wave.js'
import Wind from './wind.js'
import Levels from './levels.js'
import { FontStyles } from "./fontstyles.js";

import Canal from "./Canal.js"
import Gates from './Gates.js';


const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

const OBSTACLE_TYPE = {
    GLACIER: 0,
    ROCK: 1
};

export default class Game {

    constructor(gameWidth, gameHeight, gameLevel, ghostModeOn) {
        console.log("level: " + gameLevel + ", ghost mode: " + ghostModeOn);


        // basic game information
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.ghostMode = ghostModeOn;

        // difficulty level + properties
        this.level = Levels.getLevel(gameLevel);
        this.lives = this.level.lives;
        this.wind = this.level.wind;
        this.goal = this.level.goal;
        this.width = this.level.width;
        this.speed = this.level.speed;

        // stats to track for summary screen
        this.totalTime = 0;
        this.icebergCount = 0;

        // game objects (note wind is not a gameObject since it updates differently)
        this.ship = new Ship(this);
        this.ghost_ship = new GhostShip(this);
        this.glacier_pair = new ObstaclePair(this, null, this.level);
        this.wave = new Wave(this);
        this.wave2 = new Wave(this)
        this.wave3 = new Wave(this)
        this.gate = new Gates(this);
        this.gameObjects = [this.wave, this.wave2, this.wave3, this.ship, this.glacier_pair];//, this.gate];


        // game state!
        this.gameState = GAMESTATE.RUNNING;
    }

    start() {
        new InputHandler(this.ship);
        if (this.ghostMode == "true") this.gameObjects.push(this.ghost_ship);
    }

    update(dt, timeStamp) {
        if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;

        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
        
        this.totalTime += dt/1000;
    }

    draw(ctx) {
        this.drawRunning(ctx);

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

        // draw stats
        let icebergCountY = 30;
        FontStyles.toBodyFontStyle(ctx);
        ctx.fillText("score: ", this.gameWidth - 100, icebergCountY);
        ctx.textAlign = "right";
        ctx.fillText(this.icebergCount, this.gameWidth - 15, icebergCountY);

        // lives
        let livesY = icebergCountY * 2;
        FontStyles.toBodyFontStyle(ctx);
        ctx.fillText("lives: ", this.gameWidth - 100, livesY);
        ctx.textAlign = "right";
        ctx.fillText(this.lives, this.gameWidth - 15, livesY);

        // wind
        let windSpeedY = this.gameHeight / 2;
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity) * 100)/100;
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        FontStyles.toBodyFontStyle(ctx);
        ctx.fillText(windSpeedText, this.gameWidth - 100, windSpeedY);
        ctx.textAlign = "right";
        ctx.fillText(windDirectionText, this.gameWidth - 15, windSpeedY);

        this.drawArrow(ctx, this.gameWidth - 130, this.gameHeight / 2,
            this.gameWidth - 130, this.gameHeight / 2 + this.wind.currentVelocity * 125);
    }

    drawArrow(ctx, fromx, fromy, tox, toy){
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

    drawGameOverWindow(ctx) {
        // window
        ctx.rect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fill();

        // gmae over text
        FontStyles.toGameHeaderFontStyle(ctx);
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