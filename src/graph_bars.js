import GhostShip from "./ghost_ship.js";

// template bar struct thing--idk if this is a good way of doing this lol
var individualBar = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: ""
}
// template bar struct constructor
function MakeIndividualBar(x, y = 600 - 146, width = 20, height = 0, color = "rgba(0, 0, 0, 1)") {
    let tmp = JSON.parse(JSON.stringify(individualBar));
    tmp.x = x;
    tmp.y = y;
    tmp.width = width;
    tmp.height = height;
    tmp.color = color;
    return tmp;
}

export default class Bars {
    constructor(game, pidGraph){
        //sizing
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;

        this.ghostShip = game.ghost_ship;

        // them bars
        this.bars = [MakeIndividualBar(this.gameWidth - 130),
            MakeIndividualBar(this.gameWidth - 85),
            MakeIndividualBar(this.gameWidth - 35)];

        this.heightLimit = pidGraph.graphHeight / 2;
    }
    
    update(dt){
        if (!dt) return;
        this.updateHeight();
    }
    updateHeight(){
        for (let idx = 0; idx < 3; idx++) {
            let up = this.ghostShip.historicPID.at(-1)[idx];
            let height = up * 30000  // play w/ multipler ?
            this.bars[idx].height = Math.abs(height) < this.heightLimit ? height : Math.sign(height) * this.heightLimit;
        }
    }

    draw(ctx){
        this.bars.forEach(bar => {
            ctx.fillStyle = bar.color;
            ctx.fillRect(bar.x, bar.y, bar.width, bar.height);});
    }
}