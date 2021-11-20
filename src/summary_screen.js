import Game from './game.js'
import Summary from './summary.js'

let canvas = document.getElementById('summaryScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

let summary = new Summary(GAME_WIDTH, GAME_HEIGHT, 0);

summary.start();
summary.draw(ctx);