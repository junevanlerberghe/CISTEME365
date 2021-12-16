/**************************************************************
 * LEVEL UTILITY
 * ------------------------------------------------------------
 * utility class for levels-related stuff (e.g. fibonacci),
 * determining parameters for next level, etc.
 **************************************************************/

export var LevelUtility = {
    // gets the nth number in the fibonacci sequence
    memo: [],
    getFibonacci: function (num, memo = this.memo) {
        // from: https://medium.com/developers-writing/fibonacci-sequence-algorithm-in-javascript-b253dc7e320e
        memo = memo || {};

        if (memo[num]) return memo[num];
        if (num <= 1) return 1;

        return memo[num] = this.getFibonacci(num - 1, memo) + this.getFibonacci(num - 2, memo);
    }
}