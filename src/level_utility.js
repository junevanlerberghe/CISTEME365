import Wind from './wind.js'
/**************************************************************
 * LEVEL UTILITY
 * ------------------------------------------------------------
 * utility class for levels-related stuff (e.g. fibonacci),
 * determining parameters for next level, etc.
 **************************************************************/

export var LevelUtility = {
    // gets the nth number in the fibonacci sequence. used for determining how many icebergs need to pass until
    // hitting the next level
    getFibonacci: function (n) {
        // from: https://stackoverflow.com/questions/7944239/generating-fibonacci-sequence
        return n < 1 ? 0
        : n <= 2 ? 1
        : this.getFibonacci(n - 1) + this.getFibonacci(n - 2);
    },

    // increases strength of wind based on the level
    deltaWindAmplitude: 1.1,
    deltaWindPeriod: 0.8,
    augmentWind: function (currLevel, wind) {
        // augment amp. if amp = 0, set amp to nonzero value
        if (wind.amplitude < wind.maxAmplitude) wind.amplitude *= this.deltaWindAmplitude;
        if (wind.amplitude === 0) wind.amplitude = 0.5;

        // if period is cyclical, augment period. if acyclical, reverse wind direction
        if (wind.isCyclical() && wind.period > wind.minPeriod) wind.period *= this.deltaWindPeriod;
        if (!wind.isCyclical()) wind.reverseDirection();

        console.log("amp: " + wind.amplitude + ", period: " + wind.period);
    },

    // returns the fraction of level completed
    getFractionOfLevelCompleted: function (game) {
        return (game.obstaclesPassed - game.currLevelObstaclesPassed) / (game.nextLevelObstaclesPassed - game.currLevelObstaclesPassed);
    }
}