const $FrameRate = 60;

//   CSS: pointer-events: none;
class Progress {
    static watch (fn, options = {}) {
        const po = new Progress(options);
        setTimeout(() => {
            options.init && options.init();
            po.watch(fn)
        }, options.delay);
        return po;
    }
    constructor ({
        from = 0, to = 1, frequency = 1,
        paused, repeat = 0, duration = 1, rest = 1,
        speed = 'ease-in-out', forthAndBack = true, togglePause,
        done, report // REPORT: callback for every circle, done: callback for final
    } = {}) {
        this.assign({ from, to, paused, repeat, duration, speed, rest, done, report, forthAndBack, frequency })
        togglePause && window.on('enter space esc', () => this.togglePausing());
    }
    watch (fn, period = 0) {
        this.maybe('report', period);
        const totalFrames = Math.ceil(this.duration * $FrameRate / this.frequency);
        const ratios = (1 + totalFrames).times(n => calcRatio(n / totalFrames, this.speed));
        // console.log({ totalFrames, ratios });
        this.framesPassed = 0;
        let currentPeriod = 0;
        const process = (nth) => {
            this.framesPassed++;
            if (this.stopped) return;
            if (this.paused || (this.framesPassed % this.frequency !== 0))
                return nextFrame(() => process(nth));
            
            const ratio = ratios[nth];
            const info = { ratio, ratios, nth, reverse: this.forthAndBack && ++currentPeriod % 2 };
            
            fn(this.from + (this.to - this.from) * ratio, info);
            
            if (nth < totalFrames) {
                nextFrame(process.bind(this, nth + 1))
            } else if (--this.repeat) {
                if (this.forthAndBack) {
                    this.swap('from', 'to');
                }
                setTimeout(this.watch.bind(this, fn, period + 1), this.rest * 1000);
            } else {
                this.maybe('done');
            }
        };
        process(0);
    }
    kill () {
        this.stopped = true;
    }
    togglePausing () {
        this.paused = !this.paused;
    }
}

function calcRatio (rate, type = 'ease-in-out') { // 0 => 1
    switch (type) {
        case 'ease-in-out':
            return 0.5 - Math.cos(rate * Math.PI) / 2;
        case 'ease-out':
            return Math.sin(rate * Math.PI / 2);
        case 'ease-in':
            return 1 - Math.cos(rate * Math.PI / 2);
        case 'ease-x':
            return Math.sin(rate * Math.PI / 2) ** 2;
        case 'overturn':
            const valueMax = 1.1, rateMax = 0.8, surplus = valueMax - 1;
            if (rate < rateMax) {
                return calcRatio(rate / rateMax) * valueMax;
            } else {
                return valueMax - calcRatio((rate - rateMax) / (1 - rateMax)) * surplus;
            }
        case 'factorial':
            // y = x - 1/3!*x^3 + 1/5! * x^5
            const a = 1.5924504340362515, x = 4.668828436677955 * rate;
            return ((x - a - 1 / 6 * (x - a)**3 + 1 / 120 * (x - a)**5) + 1) / 2;
        default:
            return rate;
    }
}
// all params => [0, 1.0], x => current ratio, slope => linear speed, start => curve start
function certainCurve (rate, slope, start, totalFrames = 1 - start ) {
    let value = rate * slope;
    if (rate > start) {
        const rateCurve = Math.min(1, (rate - start) / (totalFrames - start));
        value += (0.5 - Math.cos(rateCurve * Math.PI) / 2) * (1 - slope);
    }
    return value;
}
({ Progress }).globalize()
export { calcRatio, certainCurve };
