import Game from './game.js'

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

game.start()

let lastTime = 0
function gameLoop(timeStamp) {
    let dt = timeStamp - lastTime;
    lastTime = timeStamp

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    game.update(dt, timeStamp);
    // console.log('game updating')
    game.draw(ctx);

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop);