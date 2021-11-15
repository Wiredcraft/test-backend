let MaxRGB = 256, kDefaultMinOpacity = 1;

// let cache = {};
// function factorial (n) { // n!
//     console.log('factorial ', n);
//     if (!cache[n]) {
//         cache[n] = n <= 1 ? 1 : n * factorial(n - 1);
//     }
//     return cache[n];
// }
// const factorial = Code.memorized(n => n <= 1 ? 1 : n * factorial(n - 1));
Math.ratioSin = x => (sin((x - 0.5) * pi) + 1) / 2;
const { sin, cos, random, sqrt, atan2 } = Math
Math.assign({
    nRound: (x, n = 0) => Math.round(x * 10**n) / 10 ** n,
    randomPoint: () => [
        random() * window.innerWidth - window.innerWidth / 2,
        random() * window.innerHeight - window.innerHeight / 2],
    randomInt: (min = 0, max = 10) =>  Math.within(min, max + 1).int,
    randomColor ({r = 0, g = 0, b = 0, minAlpha = kDefaultMinOpacity, maxAlpha = 1} = {}) {
        const { randomInt } = this;
        return `rgba(
            ${randomInt(r, MaxRGB)},
            ${randomInt(g, MaxRGB)},
            ${randomInt(b, MaxRGB)},
            ${ Math.within(minAlpha, maxAlpha)})`.pretty;
    },
    randomSign: () => Math.sign(random() - 0.5),
    within (min, max = 0, signRandom = false) {
        const range = Math.abs(max - min);
        return (Math.min(min, max) + random() * range) * (signRandom ? Math.randomSign() : 1);
    },
    divide (...args) {
        let res = args.shift();
        while (args.length) {
            res /= args.shift();
        }
        return res;
    },
    randomList (count, min = 0, max = 1 + min) {
        return count.compute(() => min + random() * (max - min));//.sort();
    },
    
    //Geometry
    rationalPoint (p1, p2, ratio = 0.5) {
        return [p1[0] + (p2[0] - p1[0]) * ratio, p1[1] + (p2[1] - p1[1]) * ratio];
    },
    distance (p1, p2) {
        return sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2 + ((p1[2] - p2[2])**2 || 0));
    },
    xAxisAngel (p1, p2) {   // Angel with X-Axis
        return atan2(p2[1] - p1[1], p2[0] - p1[0]);
    },
    offsetPoint (p1, p2, offset) {        // Return a point at the same line of [p1, p2], and distance with p1 => offset, tangent
        return this.rationalPoint(p1, p2, offset / this.distance(p1, p2));
    },
    bezier (points, countPoint = 200) {
        let linkDots = [],
            unit = 1 / Math.max(1, countPoint - 1),
            calcPoint = ratio => {
                let currentPoints = points;
                while (currentPoints.length > 1) {
                    const newPoints = [];
                    for (let i = 0; i < currentPoints.length - 1; i++) {
                        newPoints.push(this.rationalPoint(currentPoints[i], currentPoints[i + 1], ratio));
                    }
                    currentPoints = newPoints;
                }
                linkDots.push(currentPoints[0]);
            };
        for (let ratio = 0; ratio < 1; ratio += unit) {
            calcPoint(ratio);
        }
        calcPoint(1);
        return linkDots;
    },
    verticalAxis (from, to, ratio, height = 1, rationalHeight = true) {  // Just 2D
        if (rationalHeight) {
            height = height * this.distance(from, to);
        }
        let start = this.rationalPoint(from, to, ratio),
            deg = atan2(to[1] - from[1], to[0] - from[0]) - Math.PI / 2,
            end = [start[0] + height * cos(deg), start[1] + height * sin(deg)];
        return [start, end];
    },
    quadraticCurvePoints (from, to, ratio, height, count) {
        return this.bezier([from, this.verticalAxis(from, to, ratio, height)[1], to], count);
    },
    arrowBody (points, width = 40) {
        const inc = width / points.length / 2;
        const res = [[points[0]], [points[0]]];
        let last = points[0];
        for (let i = 1; i < points.length; i++) {
            const now = points[i];
            res[0].push(this.verticalAxis(last, now, 1, inc * i, false)[1]);
            res[1].push(this.verticalAxis(last, now, 1, inc * -i, false)[1]);
            last = now;
        }
        return res;
    },
    midPoint (p1, p2, ratioLength, ratioHeight) {
        const angel = pi - this.xAxisAngel(p1, p2);
        const [ x0, y0 ] = this.rationalPoint(p1, p2, ratioLength);
        const height = this.distance(p1, p2) * ratioHeight;
        const x1 = x0 + height * sin(angel);
        const y1 = y0 + height * cos(angel);
        return [x1, y1];
    },
    totalLength (points) {
        let length = 0;
        for (let i = 0; i < points.length - 1; i++) {
            length += this.distance(points[i], points[i + 1]);
        }
        return length;
    },
    screenPoint ([x, y, z], [px, py, pz]) { // perspective, 3D
        const ratio = (pz / (pz - z));
        x = px + (x - px) * ratio;
        y = py + (y - py) * ratio;
        return [x, y];
    },
    //intersectionOfLineCircle
    iolc (a, b, r = 1.0) { // circle center = [0, 0]  y = ax + b,  x^2 + y^2 = r^2
        const t =  sqrt((a*b)**2 + (1 + a*a)*(r*r - b*b));
        const x1 = ( t - a * b) / (1 + a * a),
            x2 = (-t - a * b) / (1 + a * a),
            y1 = a * x1 + b,
            y2 = a * x2 + b;  // => 15ms for 1 million times
        // const [x1, x2] = [ t, -t].map(S => (S - 2 * a * b) / (2 * (1 + a * a))),
        //       [y1, y2] = [x1, x2].map(x => a * x + b);  // => 266ms !!
        return [[x1, y1], [x2, y2]];
    },
    rotate (point, angel, center = [0, 0]) {
        let x1 = point[0] - center[0],
            y1 = point[1] - center[1],
            x2 = cos(angel) * x1 - sin(angel) * y1,
            y2 = sin(angel) * x1 + cos(angel) * y1;
        return [x2 + center[0], y2 + center[1]];
    },
    scale (points, ratio = [1, 1], center = points[0]) {
        points.each(pt => (2).times(n => pt[n] = center[n] + (pt[n] - center[n]) * ratio[n]));
        return points;
    },
    barChatValues (numberList, count, range = [Math.min(...numberList), Math.max(...numberList)]) {
        const unit = Math.abs(range[1] - range[0]) / count, data = [], [min] = range
        // console.log({ numberList, unit, range, left: min + 0 * unit, right: (0 + 1) * unit, min, max })
        for (let i = 0; i < count; i++) {
            data.push(numberList.filter(number => (min + number) >= i * unit && (min + number) <= (i + 1) * unit))
        }
        return data
    }
});


Math.ln = Math.log;
Math.logE = Math.log;
Math.e = Math.E;
window.pi = Math.pi = Math.PI;
window.pi2 = Math.PI * 2;
window.Deg = window.deg = pi / 180;

Math.log = (a, b) => b === undefined ? Math.logE(a) : Math.logE(b) / Math.logE(a);
Date.prototype.pretty = function () {
    return `${this.getFullYear()}-${(this.getMonth() + 1).padZero()}-${this.getDate().padZero()} ${this.getHours().padZero()}:${this.getMinutes().padZero()}:${this.getSeconds().padZero()}`
}
/*
Fold All: CTRL+K, CTRL+0 (zero)

Fold Level [n]: CTRL+K, CTRL+[n]*

Unfold All: CTRL+K, CTRL+J

Fold Region: CTRL+K, CTRL+[

Unfold Region: CTRL+K, CTRL+]
*/