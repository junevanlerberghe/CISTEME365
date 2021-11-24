export default class Wind {
    constructor(baseline, amplitude, period) {
        this.baseline = baseline; // default strength of the wind
        this.amplitude = amplitude;
        this.period = period;

        this.currentVelocity = baseline;
    }

    update(timeStamp) {
        // note we wnat timestamp rather than dt bc we want wind's velocity to by cyclical
        this.currentVelocity = this.baseline + this.amplitude * Math.sin(timeStamp/this.period);
    }
}