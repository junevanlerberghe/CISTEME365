export var ScoreHandler = {
    // constants
    popupMessagesDict: {
        1: "Start!",
        0: "Hit!",
        5: "Not Bad",
        6: "Not Bad",
        7: "Not Bad",
        8: "Good",
        9: "Great",
        10: "Perfect!"
    },


    // variables keeping track of score
    score: 0,
    scoreChange: 1,

    ghostScore: 0,
    ghostScoreChange: 1,

    updateScore: function(midpoint, positionShip) {
        this.scoreChange = ScoreHandler.getScoreChange(midpoint, positionShip);
        this.score += this.scoreChange;
    },

    updateGhostScore: function(midpoint, positionGhost) {
        this.ghostScoreChange = ScoreHandler.getScoreChange(midpoint, positionGhost);
        this.ghostScore += this.ghostScoreChange;
        console.log(this.ghostScoreChange);
    },

    getScoreChange: function(midpoint, positionShip){
        /*positionShip.x = game.ship.position.x + (game.ship.width)/2;
        positionShip.y = game.ship.position.y + (game.ship.height)/2;
        positionObstacle1.y = game.obstacle_pair.position2.y - (200 * game.obstacle_pair.passageWidth);
        positionObstacle2.y = game.obstacle_pair.position2.y;
        midpoint = (positionObstacle1.y + positionObstacle2.y)/2;
        probably do this in parameters*/
        return 10 - Math.round(0.05 * Math.abs(midpoint-positionShip)); 
    }
   
}