import {Score} from './score.js'
const OBSTACLE_TYPE = {
    GLACIER: 0,
    ROCK: 1
};
export default class ObstaclePair {
    constructor(game, obstacleType, level) {
        // graphics
        const img = obstacleType == null ? this.generateRandomImage() : this.generateImage(obstacleType);
        this.image = img;
        this.alpha = 1;

        // game variables
        this.gameHeight = game.gameHeight;
        this.gameWidth = game.gameWidth;
        this.game = game;

        // positioning, dimensions
        this.level = level;
        this.passageWidth = this.level.width;
        this.width = 100;
        this.height = this.width * 2403 / 801;
        this.minimumDistanceBetweenGlaciers = 200;
        this.position1 = {
            x:  this.gameWidth + 50,
            y: 0
        };
        this.position2 = {
            x: this.gameWidth + 50,
            y: this.position1.y + this.height + this.minimumDistanceBetweenGlaciers*this.passageWidth
        };
        this.position3 = this.position1;
        this.position4 = this.position2;

        // kinematics
        this.maxSpeed = 5;
        this.speed = 9;
    }
    update(dt) {
        if(!dt) return;
        this.position1.x -= this.speed;
        this.position2.x -= this.speed;

        //obstaining position of obstacle for new score
        if (this.position1.x < 45 && this.position1.x > 35){
            let upperbound = (this.position2.y - this.minimumDistanceBetweenGlaciers*this.passageWidth)
            let lowerbound = this.position2.y
            let midpoint = (lowerbound + upperbound/2) 
            let positionShip = (2*(this.game.ship.position.y)+this.game.ship.height)/2;
            if (!(lowerbound < this.game.ship.position.y + this.game.ship.height) && !(upperbound > this.game.ship.position.y)){
                this.game.score1 = Score.getShipPosition1(midpoint, positionShip, this.game.score1);
            }
        }

        // resetting/updating when iceberg hits end of screen (player passes iceberg)
        if (this.position1.x + this.width < -30) {
            this.position1.x = this.gameWidth + 10;
            this.position2.x = this.gameWidth + 10;
            //first glacier must be at lowest y=0 and at highest low enough so the bottom glacier covers bottom of screen
            this.position1.y = Math.random() * (this.gameHeight - (2 * this.height + this.minimumDistanceBetweenGlaciers*this.passageWidth));
            //got rid of the random for the bottom glacier, since w the levels its gonna be a set passage width
            this.position2.y = this.position1.y + this.height + this.minimumDistanceBetweenGlaciers*this.passageWidth;
            
            
            this.game.score += 1;
            

            if (this.position1.y > 0) console.log("iceberg 1 too low");
            if (this.position2.y + this.height < this.gameHeight) console.log("iceberg 2 too high");
        }
    }

    
    draw(ctx) {
        ctx.globalAlpha = this.alpha
        ctx.drawImage(this.image, this.position1.x, this.position1.y, this.width, this.height);
        ctx.drawImage(this.image, this.position2.x, this.position2.y, this.width, this.height);
        
    }

    /**************************************************************
     * IMAGE GENERATION
     * ------------------------------------------------------------
     * p much reusing same class for visually-different obstacles
     * 
     * to add a new obstacle type, add it in OBSTACLE_TYPE at the
     * top of the page. then add it to the switch statement below
     **************************************************************/
    generateImage(obstacleType) {
        let img = new Image();
        
        switch (obstacleType) {
            case OBSTACLE_TYPE.GLACIER:
                img.src = "./assets/iceberg_column.png";
                break;
            case OBSTACLE_TYPE.ROCK:
                img.src = "./assets/rock_column.png";
                break;
            default:
                console.log("invalid obstacleType");
                return this.generateRandomImage();
        }
        return img;
    }
    generateRandomImage() {
        let nObstacleTypes = Object.keys(OBSTACLE_TYPE).length;
        let randomIndex = Math.floor(Math.random() * nObstacleTypes);
        return this.generateImage(randomIndex);
    }
}