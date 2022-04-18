import Game from './game.js'

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

let game = new Game(GAME_WIDTH, GAME_HEIGHT, sessionStorage.getItem("difficulty"), sessionStorage.getItem("playerType"), sessionStorage.getItem("windType"));

game.start();

let lastTime = 0
function gameLoop(timeStamp) {
    let dt = timeStamp - lastTime;
    game.input(dt);
    lastTime = timeStamp;
    game.input(dt);
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    game.input(dt);
    game.update(dt, timeStamp);
    game.input(dt);
    game.draw(ctx);
    game.input(dt);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);