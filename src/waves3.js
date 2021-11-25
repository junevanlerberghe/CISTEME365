export default class wave3 {
    
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
        
        this.position2 = {
            x: 750,
            y: 300
        }
        
        this.position5 = {
            x: 200,
            y: 300
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
        this.position2.x -= this.speed
        if (this.position2.x < this.position5.x){
            this.position2.x = Math.random()*400 + 600
            this.position2.y = Math.random()*100 + 450
            this.position5.x = Math.random()*400 - 200
            this.image = img
            if (Math.random() > 0.5){
                this.image = imag
            }    
        }
    }
    draw(ctx){
        ctx.drawImage(this.image, this.position2.x, this.position2.y, 40, 40)
    }
}