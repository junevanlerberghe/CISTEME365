/**************************************************************
 * WIND
 * ------------------------------------------------------------
 * wind, only in y-axis
 * 
 * if period = 0, then the wind direction will shift every level
 * if period != 0, then wind will move in sine motion
 **************************************************************/
export default class Wind {
    constructor(baseline, amplitude, period) {
        this.baseline = baseline; // default strength of the wind
        this.amplitude = amplitude;
        this.period = period;

        this.maxAmplitude = 2;
        this.minCyclicalPeriod = 3000;

        this.currentVelocity = baseline;
    }

    update(timeStamp) {
        if (this.isCyclical()) {
            // case: cyclial wind (moves like in sin/cos esque shape)
            // note we wnat timestamp rather than dt bc we want wind's velocity to by cyclical
            this.currentVelocity = this.baseline + this.amplitude * Math.sin(timeStamp/this.period);
        } else {
            // case: static wind: constant strenght, switches direction every time passes iceberg
            this.currentVelocity = (this.currentVelocity > 0 ? this.amplitude : -this.amplitude);
        }        
    }

    reverseDirection() {
        this.currentVelocity *= -1;
    }

    // returns true if the wind cycles like sin/cos; false if at set velocity
    isCyclical() {
        return this.period != 0;
    }
}