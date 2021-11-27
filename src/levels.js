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
    constructor(lives, wind) {
        this.lives = lives;
        this.wind = wind;
    }


    static getLevel(level) {
        console.log(level);

        if (level == null) return this.level1();
        if (level == 1) return this.level1();
        if (level == 2) return this.level2();
        if (level == 3) return this.level3();
    }

    static level1() {
        let lives = 3;
        let wind = new Wind(0, 0, 0);
        return new Levels(lives, wind);
    }
    static level2() {
        let lives = 3;
        let wind = new Wind(0, 0.5, 5000);
        return new Levels(lives, wind);
    }
    static level3() {
        let lives = 3;
        let wind = new Wind(0, 1, 4000);
        return new Levels(lives, wind);
    }
}