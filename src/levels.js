import Wind from './wind.js'

/**************************************************************
 * LEVELS
 * ------------------------------------------------------------
 * there's probably a better way of doing this but o well
 * 
 * if adding a new level, make a new level method and add to
 * getLevel. getLevel is used to get the level w/ level number
 **************************************************************/
export default class Levels {
    constructor(lives, wind, goal, width, speed) {
        //goal = number of icebergs to pass to complete level
        //width = percent * how wide the passage is (200), so if we want it smaller, width < 1
        //there's def a better way to implement this ^ but I can't think of anything better rn so feel free to change ofc
        //speed = horizontal speed of game, ex: 0.2x current speed
        this.lives = lives;
        this.wind = wind;
        this.goal = goal;
        this.width = width;
        this.speed = speed;
    }


    static getLevel(level) {
        if (level == null) return this.level1();
        if (level == 1) return this.level1();
        if (level == 2) return this.level2();
        if (level == 3) return this.level3();
    }

    static level1() {
        let lives = 3;
        let wind = new Wind(0, 0, 0);
        let goal = 1;
        let width = 1; //keeping dist the same
        let speed = 0.2;
        return new Levels(lives, wind, goal, width, speed);
    }
    static level2() {
        let lives = 3;
        let wind = new Wind(0, 0.5, 5000);
        let goal= 1;
        let width = 1;
        let speed = 0.2;
        return new Levels(lives, wind, goal, width, speed);
    }
    static level3() {
        let lives = 3;
        let wind = new Wind(0, 1, 4000);
        let goal = 2;
        let width = 0.8; //passage is a little smaller
        let speed = 0.2;
        return new Levels(lives, wind, goal, width, speed);
    }
}