export default class wave {
    constructor(game){
        const img = new Image();
        img.src = "./assets/wave3.png";
        const imag = new Image();
        imag.src = "./assets/wave3.png";
        this.image = img;    
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;    
        this.width = 40;
        this.height = 40;
        this.position1 = {
            x: 50,
            y: 100
        };
        
        //positions 4-6 are ending positions for the waves. waves come and go you know
        this.position4 ={
            x: 0,
            y: 100
        };

        this.speed = 5;
        this.game = game;
    }
    update(dt) {
        if (!dt) return;
        const img = new Image();
        img.src = "./assets/wave3.png";
        const imag = new Image();
        imag.src = "./assets/wave2.png";
        const img2 = new Image();
        img2.src = "./assets/wave3light.png";
        const imag2 = new Image();
        imag2.src = "./assets/wave2light.png";

        this.position1.x -= this.speed;
        //places new wave randomly and sets end point for wave randomly
        if (this.position1.x < this.position4.x) {
            this.position1.x = Math.random()*400 + 600;
            this.position1.y = Math.random()*100 + 50;
            this.position4.x = Math.random()*400 - 200;
            this.image = imag //imag2;
            if (Math.random() > 0.5){
                this.image = img //img2;
            }    
        }
        //*So this was my attempt at making the waves fade in and out with the light wave png...
        //but I'm struggling to get the And Statement to work. I have a feeling that a similar problem is happening ...
        //with the collision detection thing for the ship. I might comeback to this later, but staring at it is giving me a headache....
        //To anyone, feel free to tackle this

        //if (this.position1.x - this.position4.x <= 500 && this.image === img2){
            //if (this.image == img2){
             //   this.image = img
           // }
          //  }
            //else if (this.image == imag2){
            //    this.image = imag
            //}
        }
        
        
    
    draw(ctx){
        ctx.drawImage(this.image, this.position1.x, this.position1.y, 40, 40);
    }
}