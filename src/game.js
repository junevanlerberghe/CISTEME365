import Ship from './ship.js'
import InputHandler from './input.js'
import glacier from './glacier.js';

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, 800, 600)

let ship = new Ship(GAME_WIDTH, GAME_HEIGHT)
let glaciers = new glacier(GAME_WIDTH, GAME_HEIGHT);
new InputHandler(ship);

ship.draw(ctx)

let lastTime = 0

ctx.fillStyle = '#0ff'
ctx.fillRect(100, 100, 200, 200);
function gameLoop(timeStamp) {
    let dt = timeStamp - lastTime;
    lastTime = timeStamp
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ship.update(dt);
    ship.draw(ctx);
    glaciers.update(dt);
    glaciers.draw(ctx);
    requestAnimationFrame(gameLoop)
}

gameLoop();
ctx.fillStyle = '#0ff'
ctx.fillRect(100, 100, 200, 200);


