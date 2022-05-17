import Game from './game.js'

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

/* Setting Current Slider Values */
var slider = document.getElementById("pSlider");
var output = document.getElementById("pval");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

var slider2 = document.getElementById("iSlider");
var output2 = document.getElementById("ival");
output2.innerHTML = slider2.value;

slider2.oninput = function() {
  output2.innerHTML = this.value;
}

var slider3 = document.getElementById("dSlider");
var output3 = document.getElementById("dval");
output3.innerHTML = slider3.value;

slider3.oninput = function() {
  output3.innerHTML = this.value;
}
/* End Setting Values */
//if you're changing the game width and/or height, also change it on line 55 in game.html
const GAME_WIDTH = 700;
const GAME_HEIGHT = 500;

ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

let game = new Game(GAME_WIDTH, GAME_HEIGHT, sessionStorage.getItem("difficulty"), sessionStorage.getItem("playerType"), sessionStorage.getItem("windType"));

game.start();

let lastTime = 0
function gameLoop(timeStamp) {
    let dt = timeStamp - lastTime;
    game.setDT(dt)
    console.log('dt', dt)
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