export default class wave {
    
    constructor(game){
        const img = new Image()
        img.src = "./assets/wave3.png"
        const imag = new Image()
        imag.src = "./assets/wave.png"
        this.image = img;    
        this.gameHeight = game.gameHeight
        this.gameWidth = game.gameWidth        
        this.width = 40
        this.height = 40
        this.position1 = {
            x: 50,
            y: 100
        }
        
        //positions 4-6 are ending positions for the waves. waves come and go you know
        this.position4 ={
            x: 0,
            y: 100
        }

        this.speed = 5
        this.game = game
    }
    update(dt) {
        if (!dt) return;
        const img = new Image()
        img.src = "./assets/wave3.png"
        const imag = new Image()
        imag.src = "./assets/wave2.png"
        
        this.position1.x -= this.speed
        if (this.position1.x < this.position4.x){
            this.position1.x = Math.random()*400 + 600
            this.position1.y = Math.random()*100 + 50
            this.position4.x = Math.random()*400
            this.image = img
            if (Math.random() > 0.5){
                this.image = imag
            }    
        }

    }
    draw(ctx){
        ctx.drawImage(this.image, this.position1.x, this.position1.y, 40, 40)
    }
}