import Ship from './ship.js'
import InputHandler from './input.js'
import glacier from './glacier.js';
import Wind from './wind.js'

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, 800, 600)

let wind = new Wind(0, 2, 5000); // note that these numbers are placeholder for testing
let ship = new Ship(GAME_WIDTH, GAME_HEIGHT, wind)
let glacier_1 = new glacier(GAME_WIDTH, GAME_HEIGHT);
let glacier_2 = new glacier(GAME_WIDTH, GAME_HEIGHT);
let gameObjects = [ship, glacier_1, glacier_2];
new InputHandler(ship);

ship.draw(ctx)

let lastTime = 0

ctx.fillStyle = '#0ff'
ctx.fillRect(100, 100, 200, 200);

function gameLoop(timeStamp) {
    let dt = timeStamp - lastTime;
    lastTime = timeStamp

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    update(dt, timeStamp);
    draw(ctx);
    requestAnimationFrame(gameLoop)
}

function update(dt, timeStamp) {
    wind.update(timeStamp);
    gameObjects.forEach(x => x.update(dt));
}
function draw(ctx) {
    gameObjects.forEach(x => x.draw(ctx));
}

gameLoop();