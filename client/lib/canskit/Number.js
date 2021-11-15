import './Function.js';

Number.gets({
    value () {
        return this.toString().value;       //floatValue
    },
    int () {
        return Number.parseInt(this);
    },
    isInt () {
        return this === Number.parseInt(this);
    }
});
Number.extendMethods({
    // text (unit) {
    //     if (unit > 1000) {
    //         return (this / 1000) + 'k';
    //     } else {
    //         let fixed = Math.log10(unit);
    //         return this.toFixed(fixed < 0 ? -fixed : 0);
    //     }
    // },
    toPrice (kSep = 3) {
        const string = Math.abs(this).toFixed().split('')
        const mod = string.length % kSep
        const bits = []
        for (let i = mod; i < string.length; i += kSep) {
            if (i !== 0) {
                bits.push(i)
            }
        }
        
        for (let n = bits.length - 1; n >= 0; n--) {
            string.splice(bits[n], 0, ',')
        }
        return (this < 0 ? '-' : '') + string.join('')
    },
    sign () {
        return Math.sign(this);
    },
    randomInt (includeSelf) {
        return Math[includeSelf ? 'round' : 'floor'](Math.random() * this); // Not include
    },
    times (fn, from = 0) {
        return this <= 0 ? [] : Number.rangedList(from, this + from - 1).map(fn.unary);   // or not unary?
        // return fn.times(this, from);
        // const res = [];
        // for (let i = 1; i <= this; i++) {
        //     res.push(fn(i));
        // }
        // return res;
    },
    compute (fn, ...args) {
        return fn.repeat(this, ...args);
    },
    round (count = 2) {
        return Math.round(this * 10**count) / 10 ** count;
    },
    inRange (min = 0, max = 1 + min) {
        return Math.max(min, Math.min(this, max));
    },
    sqrt () {
        return Math.sqrt(this);
    },
    ceil () {
        return Math.ceil(this);
    },
    floor () {
        return Math.floor(this);
    },
    padZero (n = 2) {
       return this.toString().padStart(n, '0');
    },
    insideRange (a, b) {
        const min = Math.min(a, b), max = a + b - min;
        return this >= min && this <= max;
    },
    outsideRange (a, b) {
        return this.oppositeFunc('insideRange')(a, b);
    },
    postgresDate () {
        const date = new Date(new Date(this * 1000).getTime() + new Date('1900-01-01').getTime() + new Date('1970-1-1').getTime()/* timezone*/)  
        return date.prettyPrint()
    }
});

Number.assign({
    rangedList (from, to) {
        if (to === undefined) {
            to = from;
            from = 0;
        }
        from = Number.parseInt(from);
        to = Number.parseInt(to);
        const result = [], sign = Math.sign(to - from) || 1;    // if to -> NaN ...
        for (let i = from; i !== to + sign; i += sign) {
            result.push(i);
        }
        return result;
    },
    
    random: (max, min = 0) => Math.round(Math.random() * Math.abs(max - min)) + Math.min(min, max),
    maxCommonDivisor (a, b) {
        if (a % b === 0) {
            return b;
        }
        return Number.maxCommonDivisor(b, a % b);
    },
    minCommonMultiple (a, b) {
        return a * b / this.maxCommonDivisor(a, b);
    }
    // random: (max = 100) => (max + 1).randomInt()
});

const $currentYear = new Date().getFullYear()
Date.extendMethods({
    day (sep = '/') {
        return `${this.getFullYear()}${sep}${(this.getMonth() + 1).padZero()}${sep}${this.getDate().padZero()}`//.replace(`${$currentYear}${sep}`, '');
    },
    time (withSeconds = true) {
        return `${this.getHours().padZero()}:${this.getMinutes().padZero()}` + (withSeconds ? `:${this.getSeconds().padZero()}` : '');
    },
    prettyPrint () {
        const now = new Date()
        const passed = now - this
        const today = this.getFullYear() === now.getFullYear() && this.getMonth() === now.getMonth() && this.getDate() === now.getDate()
        const yesterday = passed > 0 && (now - this) < (48 * 3600000) && (now.getDay() - this.getDay()).inside(1, -6)   // Monday vs Sunday 
        let date 
        if (passed > 0 && passed < 120000) {
            return 'Just Now'
        } else if (today) {
            date = 'Today'
        } else if (yesterday) {
            date = 'Yesterday'
        } else {
            date = `${this.getFullYear()}-${(this.getMonth() + 1).padZero()}-${this.getDate().padZero()}`
        }
        return `${date} ${this.time()}`
    },
    chinesePrettyPrint () {
        const now = new Date()
        const passed = now - this
        const today = this.getFullYear() === now.getFullYear() && this.getMonth() === now.getMonth() && this.getDate() === now.getDate()
        const yesterday = passed > 0 && (now - this) < (48 * 3600000) && (now.getDay() - this.getDay()).inside(1, -6)
        const time = this.time()
        if (passed > 0 && passed < 120000) {    // 2 minutes
            return '刚刚'
        } else if (today) {
            return `今天 ${time}`
        } else if (yesterday) {
            return `昨天 ${time}`
        } else if (passed / 3600000 / 24 < 30) {
            return `${Math.floor(passed / 3600000 / 24)}天前 ${time}`
        } else {
            return this.prettyPrint()
        }
    }
});
Date.assign({
    timeNow () {
        return (new Date()).time()
    },
    prettyNow () {
        return (new Date()).prettyPrint()
    },
    currentTimestamp () {
        return (new Date()).getTime()
    }
})

Boolean.gets({
    int () {
        return this ? 1 : 0;
    }
});
