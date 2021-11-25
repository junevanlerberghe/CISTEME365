import Ship from './ship.js'
import InputHandler from './input.js'
import glacier from './glacier_pair.js';
import Wind from './wind.js'
import { FontStyles } from "./fontstyles.js";
import wave from "./waves.js";
import wave2 from "./waves2.js";
import wave3 from "./waves3.js"

const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.lives = 1;
        this.totalTime = 0;
        this.icebergCount = 0;
    }

    start() {
        this.gameState = GAMESTATE.RUNNING;
        this.wind = new Wind(0, 2, 5000); // note that these numbers are placeholder for testing
        this.ship = new Ship(this)
        this.glacier_pair = new glacier(this);
        this.wave = new wave(this);
        this.wave2 = new wave2(this)
        this.wave3 = new wave3(this)
        this.gameObjects = [this.wave, this.wave2, this.wave3, this.ship, this.glacier_pair];
        new InputHandler(this.ship);
        this.icebergCount = 0;
        this.totalTime = 0;
    }

    update(dt, timeStamp) {
        if(this.lives <= 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;
        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
        this.totalTime += dt/1000;
        // console.log(this.totalTime);
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
        // wind
        let windSpeedText = "" + Math.round(Math.abs(this.wind.currentVelocity) * 100)/100;
        let windDirectionText = "mph " + (this.wind.currentVelocity > 0 ? "S" : "N");
        FontStyles.toBodyFontStyle(ctx);
        ctx.fillText(windSpeedText, this.gameWidth - 100, 30);
        ctx.textAlign = "right";
        ctx.fillText(windDirectionText, this.gameWidth - 15, 30);
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
}