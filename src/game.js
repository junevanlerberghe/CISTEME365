import Ship from './ship.js'
import InputHandler from './input.js'
import glacier from './glacier_pair.js';
import Wind from './wind.js'

const GAMESTATE = {
    GAMEOVER: 0,
    RUNNING: 1
};

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.gameHeight = gameHeight;
        this.gameWidth = gameWidth;
        this.lives = 2;
    }

    start() {
        document.getElementById('summary').style.display = 'none';
        this.gamestate = GAMESTATE.RUNNING;
        this.wind = new Wind(0, 2, 5000); // note that these numbers are placeholder for testing
        this.ship = new Ship(this, this.wind)
        this.glacier_pair = new glacier(this);
        this.gameObjects = [this.ship, this.glacier_pair];
        new InputHandler(this.ship);
    }

    update(dt, timeStamp) {
        if(this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;
        if(this.gameState === GAMESTATE.GAMEOVER) return;
        this.wind.update(timeStamp);
        this.gameObjects.forEach(x => x.update(dt));
    }

    draw(ctx) {
        this.gameObjects.forEach(x => x.draw(ctx));

        if(this.gameState == GAMESTATE.GAMEOVER) {
            ctx.rect(this.gameWidth/4, this.gameHeight/4, this.gameWidth/2, this.gameHeight/2);
            ctx.fillStyle = "rgba(0,0,0,0.65)";
            ctx.fill();

            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
            document.getElementById('summary').style.display = 'block';
            document.getElementById('summary').style.left = this.gameWidth/2 - 60;
            document.getElementById('summary').style.top = -280;
        }
    }
}