import Ship from './ship.js'
import InputHandler from './input.js'

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, 800, 600)

let ship = new Ship(GAME_WIDTH, GAME_HEIGHT)

new InputHandler(ship);

ship.draw(ctx)

let lastTime = 0

function gameLoop(timeStamp) {
    let dt = timeStamp - lastTime;
    lastTime = timeStamp

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ship.update(dt);
    ship.draw(ctx);

    requestAnimationFrame(gameLoop)
}

gameLoop();

