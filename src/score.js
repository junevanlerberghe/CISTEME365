//import Ship from './ship.js'
//import ObstaclePair from './obstacle_pair'

export var Score = {
    /*constructor(game){
        //this.game = game
        this.ship = game.ship
        this.score = 0
        //this.gameWidth = game.gameWidth
        this.obstaclepair = game.obstacle_pair
    }*/
    /*update:function(){}
        getShipPosition1()
    }*/
    /*getShipPosition(){
        positionShip.x = Ship.position.x + (Ship.width)/2
        positionShip.y = Ship.position.y + (Ship.height)/2
        positionObstacle1.y = ObstaclePair.position2.y - (200 * ObstaclePair.passageWidth)
        PositionObstacle2.y = ObstaclePair.position2.y
        if (positionShip.y < PositionObstacle2){
            alert('something is working')
        } 
        
    }*/
    getScore1: function(midpoint, positionShip, score1){
        /*positionShip.x = game.ship.position.x + (game.ship.width)/2;
        positionShip.y = game.ship.position.y + (game.ship.height)/2;
        positionObstacle1.y = game.obstacle_pair.position2.y - (200 * game.obstacle_pair.passageWidth);
        positionObstacle2.y = game.obstacle_pair.position2.y;
        midpoint = (positionObstacle1.y + positionObstacle2.y)/2;
        probably do this in parameters*/
        return score1 + 11 - Math.round(0.01 * Math.abs(midpoint-positionShip)); 
        
    }
   
}