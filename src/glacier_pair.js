export default class glacier_pair {
    constructor(game) {
        const img = new Image();
            img.src = "./assets/iceberg_column.png";

        this.image = img;
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.width = 100;
        this.height = this.width * 2403 / 801;
        this.minimumDistanceBetweenGlaciers = 200;
        this.position1 = {
            x:  this.gameWidth + 50,
            y: 0
        };
        this.position2 = {
            x: this.gameWidth + 50,
            y: this.position1.y + this.height + this.minimumDistanceBetweenGlaciers
        };
        this.position3 = this.position1;
        this.position4 = this.position2;
        this.maxSpeed = 5;
        this.speed = 9;
        this.game = game;
        this.alpha = 1;
    }
    update(dt) {
        if(!dt) return;
        this.position1.x -= this.speed;
        this.position2.x -= this.speed;
        if (this.position1.x + this.width < -30) {
            this.position1.x = this.gameWidth + 10;
            this.position2.x = this.gameWidth + 10;
            //first glacier must be at lowest y=0 and at highest low enough so the bottom glacier covers bottom of screen
            this.position1.y = Math.random() * (this.gameHeight - (2 * this.height + this.minimumDistanceBetweenGlaciers));
            //second glacier is a minimum of 200px away from first plus random dist up to 80
            //this is to make sure the distance is never less than the height of the ship
            this.position2.y = this.position1.y + this.height + this.minimumDistanceBetweenGlaciers + Math.random()*80;
            this.game.icebergCount += 1;

            if (this.position1.y > 0) console.log("iceberg 1 too low");
            if (this.position2.y + this.height < this.gameHeight) console.log("iceberg 2 too high");
        }
    }

    //When the iceberg disappears off the side of the screen, finds random y positions, and reappear, the pid controller...
    //causes the boat to jump. With this slow function, I was trying to make the icebergs slowly change to its new y positions ...
    //while off screen, so that the ghost boat slowly adjusts to the new y-mid point, rather than having the inital small jump.
    slow(){
        if (this.position1.x + this.width < -25 && this.position1.x + this.width > -40){
            this.position3.y = Math.random() * (this.gameHeight/2 - this.height)
            this.position4.y = this.position1.y + 4*this.height + Math.random()*80
            positionDifference1 = this.position3.y - this.position1.y
            positionDifference2 = this.position4.y - this.position2.y}
        if (this.position1.x + this.width < -40 && this.position1.x + this.width > -100 ){
            this.position1.y += positionDifference1/60
            this.position2.y += positionDifference2/60}
        if (this.position1.x + this.width < -110){
            this.position1.x = this.gameWidth + 10
            this.position2.x = this.gameWidth + 10
            this.position1.y = this.position3.y
            this.position2.y = this.position4.y
        }
        
    }
    draw(ctx) {
        ctx.globalAlpha = this.alpha
        ctx.drawImage(this.image, this.position1.x, this.position1.y, this.width, this.height);
        ctx.drawImage(this.image, this.position2.x, this.position2.y, this.width, this.height);
        
    }
}