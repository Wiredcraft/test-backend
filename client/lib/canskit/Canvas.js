
//context.constructor.name === 'CanvasRenderingContext2D'
CanvasRenderingContext2D.gets({
    width () {
        return this.canvas.width;
    },
    height () {
        return this.canvas.height;
    }
});
HTMLCanvasElement.extendMethods({
    image () {
        const img = new Image();
        img.src = this.toDataURL();
        return img;
    },
    clear () {
        const ctx = this.getContext('2d')
        ctx.clearRect(0, 0, this.width, this.height);
    },
});
CanvasRenderingContext2D.extendMethods({
    drawLine (x, y, x2, y2, { color = 'rgb(11, 22, 33)', dash = [12, 6], width = 1 } = {}) {
        this.begin();
        this.moveTo(x, y);
        this.lineTo(x2, y2);
        this.strokeStyle = color;
        this.setLineDash(dash);
        this.lineWidth = width;
        this.stroke();
    },
    drawStar (x = Math.random() * this.canvas.width - this.canvas.width / 2,
              y = Math.random() * this.canvas.height - this.canvas.height / 2,
              r = 10 + Math.random() * 10,
              color = Math.randomColor()) {
        this.begin();
        this.fillStyle = color;
        const shadowStar = Math.random() > 0.7;
        const [powerX, powerY] = (() => 3 + 2 * Math.floor(Math.random() * 3)).repeat(2);
        const offsetX = shadowStar ? 10000 : 0;
        const plus = (Math.random() - 0.5) * 5;
        // const [randomX, randomY] = within.repeat(2, 0.7, 1.3);
        
        for (let i = 0; i <= pi * 2; i += 0.1) {
            this.lineTo(
                x + r * Math.cos(i) ** powerX + plus * Math.cos(i) - offsetX,
                y + r * Math.sin(i) ** powerY + plus * Math.sin(i));
        }
        // this.stroke();
        shadowStar && this.assign({
            shadowColor: color,
            shadowBlur: shadowStar ? Math.within(3, 12) : Math.within(12, 30),
            shadowOffsetX: shadowStar ? offsetX : Math.within(-20, 20),
            shadowOffsetY: shadowStar ? 0 : Math.within(-10, 30)
        });
        this.fill();
        return [x, y];
    },
    drawPoint (x = Math.random() * this.canvas.width - this.canvas.width / 2,
               y = Math.random() * this.canvas.height - this.canvas.height / 2,
               r = 15 + Math.random() * 10,
               color = Math.randomColor()) {
        this.begin();
        this.fillStyle = color;
        this.arc(x, y, r * 0.6, 0, pi * 2);
        this.fill();
        return [x, y];
    },
    clearScreen () {
        const canvas = this.canvas;
        this.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    },

    drawAxis ({ clear = true, color = 'rgb(22, 33, 66)' } = {}) {
        clear && this.clear();
        this.temp(() => {
            // this.drawLine(-this.canvas.width / 2, 0, this.canvas.width, 0, color);
            // this.drawLine(0, -this.canvas.height / 2, 0, this.canvas.height, color);
            //   |
            //   V
            // this.drawLine.iterate(this,
            //     [-this.canvas.width / 2, 0, this.canvas.width, 0, color],
            //     [0, -this.canvas.height / 2, 0, this.canvas.height, color]
            // );
            // Equals:
            this.lineWidth = 0.7;
            Code.zip2(
                [-this.canvas.width / 2, 0],
                [0, -this.canvas.height / 2],
                [this.canvas.width / 2, 0],
                [0, this.canvas.height],    // h /2
                [color],
                this.drawLine.bind(this));
        });
    },
    linkDots (...dots) {
        dots.each(p => this.lineTo(...p));
    },
    smoothLineDots (dots, { ratioStart = 0.2, ratioEnd = 0.8 } = {}) {
        let prev = dots[0]
        this.lineTo(...prev)
        this.lineTo(...dots[1])
        for (let i = 1; i < dots.length - 1; i++) {        
            const curr = dots[i],
                next = dots[i + 1],
                pt1 = Math.rationalPoint(prev, curr, ratioStart + 1),
                pt2 = Math.rationalPoint(curr, next, ratioEnd)
    
            this.bezierCurveTo( ...pt1, ...pt2, ...next)       
            prev = curr
        }
    },
    floatUpData (dots, config = { fromBottom: true }  ) {
        this.begin()
        
        const first = [dots[0][0], config.fromBottom ? 0 : this.height], 
              last = [dots.last()[0], config.fromBottom ? 0 : this.height]
        Progress.watch(ratio => {
            this.moveTo(...first)
            this.smoothLineDots(dots.map(([x, y]) => [
                x, 
                config.fromBottom ? y * ratio : this.height - (this.height - y) * ratio
            ]))
            this.lineTo(...last)
            this.fill()
        }, config)
    },
    connect (...points) {
        this.moveTo(...points[0]);
        // if (!window.test) {
        //     console.log(points);
        //     window.test = true;
        // }
        points.each(p => this.lineTo(...p));
        this.closePath();       // this.lineTo(...points[0]);
    },
    centerRect (ratio = 0.5) {
        const canvas = this.canvas;
        const rect = [-canvas.width * ratio / 2, -canvas.height * ratio / 2, canvas.width * ratio, canvas.height * ratio];
        this.begin();
        this.rect(...rect);
        const [x, y, width, height] = rect;
        return { x, y, width, height };
    },
    updownImage (...args) { //revert vertical direction
        this.scale(1, -1);
        this.drawImage(...args);
        this.scale(1, -1);
    },
    temp (func, ...args) {
        this.save();
        func.apply(this, args);
        this.restore();
    },
    tempReset (func, ...args) {
        this.temp(function () {
            this.resetTransform();
            func.apply(this, arguments);
        }, ...args);
    },
    clear () {
        this.temp(() => {
            this.resetTransform();
            this.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.begin();
        });
        return this;
    },
    randomRadialGradient (count = 2, corner = { x: 0, y: 0}) {
        const grad = this.createRadialGradient(corner.x, corner.y, 0, corner.x, corner.y, this.canvas.height / 2);
        
        [0, ...Math.randomList(count - 2).sort(), 1].each(offset => grad.addColorStop(offset, Math.randomColor()));
        return grad;
    },
    randomizeLinearFillStyle () {
        const grad = this.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        grad.addColorStop(0, '#' + Math.randomInt.repeat(4, 0, 10).map(x => x.toString(16)).join(''))
        //Math.randomInt(5, 12).toString(16).repeat(3));
        grad.addColorStop(1, '#' + Math.randomInt.repeat(4, 5, 15).map(x => x.toString(16)).join(''))
        // Math.randomInt(8, 15).toString(16).repeat(3));
        this.fillStyle = grad;
        console.log({grad});
    },
    randomizeFillStyle (...args) {
        this.fillStyle = this.randomRadialGradient(...args);
    },
    strokeColor (strokeStyle, lineWidth) {
        this.assign({strokeStyle, lineWidth});
        this.stroke();
        return this;
    },
    fillColor (color) {
        this.fillStyle = color;
        this.fill();
        return this;
    },
    loadImage (src, callback) {
        const img = new Image();
        img.assign({ src });
        img.on('load', callback.bind(null, img));
    },
    
    drawGrid (row, column, strokeStyle) {
        this.begin();
        const { width, height } = this;
        for (let i = 1; i < row; i++) {
            const y = height / row * i;
            this.moveTo(0, y);
            this.lineTo(width, y);
        }
        for (let i = 1; i < column; i++) {
            const x = width / column * i;
            this.moveTo(x, 0);
            this.lineTo(x, height);
        }
        //TODO: Draw unit...
        this.assign({ strokeStyle }).stroke();
    },
    roundRect (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y,   x+w, y+h, r);
        this.arcTo(x+w, y+h, x,   y+h, r);
        this.arcTo(x,   y+h, x,   y,   r);
        this.arcTo(x,   y,   x+w, y,   r);
        this.closePath();
        return this;
    },
    drawStatisticsCurve (to, fillStyle, { maxValue = 1, duration = 1, from = (0).repeat(to.length), grid  } = {}) {
        let count = to.length;

        if (count !== from.length) {
            // TODO: Update the dataList and from
            console.log('Not same length!');
            count = Number.minCommonMultiple(count, from.length);
        }
        // console.log({ dataList, from });
        const unitWidth = this.width / (to.length - 1);

        // for (let i = 0; i < dataList.length; i++) {
        //     this.drawPoint(i * unitWidth, dataList[i] / maxValue * this.height, 4, this.canvas.cssVar('color-strong'));
        // }
        
        Progress.watch(rate => {
            this.clear();
            let values = from.map((x, i) => x + (to[i] - x) * rate);
            this.begin();
            grid && this.drawGrid(grid.row, grid.column, grid.color);
    
            this.lineJoin = 'round';
            // this.lineWidth = 1;
            this.moveTo(0, values[0] / maxValue * this.height);
            
            let i, ratio = 0.5;
            for (i = 1; i < values.length; i++) {       /* values.length - 2 for bezier curve*/
                this.lineTo(i * unitWidth, values[i] / maxValue * this.height);  // TODO: Maybe use sin/cos ?
                // this.quadraticCurveTo(
                //     i * unitWidth,
                //     values[i] / maxValue * this.height,
                //     (i + ratio) * unitWidth, (values[i] + (values[i + 1] - values[i]) * ratio) / maxValue * this.height);
            }
    
            // this.quadraticCurveTo(
            //     i * unitWidth, values[i++] / maxValue * this.height,
            //     i * unitWidth, values[i] / maxValue * this.height);
    
            this.assign({fillStyle});
            this.stroke();
            this.linkDots([this.width, 0], [0, 0]);
            this.fill();
        }, { duration })
    },
    drawWaiting ({ radius = 70, lineWidth = 3, color = '#9fc5d3', colorBg = 'white', x = 0, y = 0, speed = 1, delay } = {}) {
        // TODO: color randomly changing...
        this.drawWaiting.done = false; // The Global variable for this function! Because setTimeout will go to another
        let current = 0, finish = () => this.drawWaiting.done = true;
        
        if (delay) {
            setTimeout(this.drawWaiting.bind(this, { radius, lineWidth, color, colorBg, x, y, speed}), delay * 1000);
            return finish;
        }
        // Memorize it?
        const $timeFast = 0.3,
            $speedSlow = 0.4,
            $delay = $timeFast * 0.7, $speed = 0.01 * speed,
            $speedFast = (1 - $speedSlow) / $timeFast;
    
        const deg = (ratio) => {
            const exist = Math.floor(ratio),
                  current = ratio - exist,
                  fastTime = current - (1 - $timeFast),//  Math.min(current, $timeFast);// - $timeSlow,
                  length = current * $speedSlow + (fastTime > 0 ? (Math.sin((fastTime / $timeFast - 1/2) * pi) + 1) / 2 * fastTime * $speedFast : 0);
        
            return (exist + length) * 2.5 * pi;
        };
        const $offset = deg($delay * 0.9);
        const draw = () => {
            current += $speed;
            const from = deg(current) + $offset, to = deg(current + $delay);
        
            // Clear
            this.begin();
            this.strokeStyle = colorBg;
            this.lineWidth = lineWidth + 3;
            this.arc(x, y, radius - 1, 0, Math.PI * 2);
            this.stroke();
        
            // Draw ratio arc
            this.lineWidth = lineWidth;
            this.begin();
            this.strokeStyle = color;
            this.moveTo(radius * Math.cos(from) + x, radius * Math.sin(from) + y);
            this.arc(x, y, radius, from, to);
            this.stroke();
            
            // console.log('draw');
        };
        const play = () => nextFrame(() => draw() || this.drawWaiting.done || play());
        play();
        return finish;
    },
    bottomUp () {
        this.scale(1, -1);
        window.on('resize', () => this.scale(1, -1));
    },
    curveEnd (line1, line2) {  // Array of points [[x1, y1], [x2, y2]...]
        const distance = Math.distance(line1.last(), line2.last());
        this.lineTo(...line1.last());
        this.bezierCurveTo(...([line1, line2].map(line => Math.offsetPoint(...line.lastList(2), distance))).flat(), ...line2.last());
        return this;
    },
    meteor ({ from, to, curveRatio, curveHeight, fatness, displayPart, duration, done, color = '#8af', frequency } = {} ) {     //Animation!
        // console.log({ from, to, curveRatio, curveHeight, fatness, displayPart, duration, done, color} );
        // TODO: Use left/right dots
        const count = Math.distance(from, to).int + 100,
              curve1 = Math.quadraticCurvePoints(from, [to[0], to[1] + fatness / 2], curveRatio, curveHeight, count),
              curve2 = Math.quadraticCurvePoints(from, [to[0], to[1] - fatness / 2], curveRatio, curveHeight, count);

        const draw = (draw1, draw2, opacity = 1) => {
            // if (opacity !== 1) {
            //     console.log(Math.sqrt(opacity));
            // }
            this.clear();
            if (draw1.length < 2) { return }
            this.linkDots(...draw1);

            this.curveEnd(draw1, draw2);
            this.linkDots(...draw2.reverse());
            this.curveEnd(draw2, draw1.reverse());

            this.fillColor(color.colorWithOpacity(Math.sqrt(opacity)));
        };
        Progress.watch(ratio => draw(...[curve1, curve2].map(curve => curve.frontPart(ratio).endPart(displayPart))), {
            duration, frequency, speed: 'ease-in',
            done: () => Progress.watch(ratio => draw(...[curve1, curve2].map(curve => curve.endPart(displayPart * (1 - ratio))), 1 - ratio),         //reverse
                { duration, frequency, done, speed: 'ease-out' })
            
        });
    },
    drawArrow (dots, config = {}) {
        const points = Math.bezier(dots), origin = dots[0],
            arrowHeight = 3,
            { width = Math.totalLength(points) * 0.03, animate, done = _, type } = config,
            wholeCurves = Math.arrowBody(points, width),
            ratioLength = Math.within(0.4, 0.6),
            rationHeight = dots.length <= 2 ? 0 : Math.within(0.1, 0.2),
            start = dots[0], end = points.last(),
            finalEnd = Math.verticalAxis(wholeCurves[0].last(), wholeCurves[1].last(), 0.5, arrowHeight)[1],
            factor = [((end[0] - start[0]) / (finalEnd[0] - start[0])) || 1,  ((end[1] - start[1]) / (finalEnd[1] - start[1])) || 1],
            draw = ratio => {
                const curves = wholeCurves.map(c => c.slice(0, Math.round(wholeCurves[0].length * ratio)).jsonString().jsonObject());
                if (curves[0].length < 1) { return }
                animate && this.clean();

                let [p1, p2] = curves.map(c => c.last()),
                    arrowWidth = Math.distance(p1, p2),
                    arrowEnd = Math.verticalAxis(p1, p2, 0.5, arrowHeight)[1],
                    pSharp;
                Math.scale([...curves.flat(), arrowEnd], factor, origin);
                this.begin();

                this.moveTo(...curves[0][0]);
                this.linkDots(...curves[0]);

                pSharp = Math.rotate(Math.offsetPoint(p1, p2, arrowWidth), pi * -1.3, p1);
                this.quadraticCurveTo(...Math.midPoint(p1, pSharp, ratioLength, -rationHeight), ...pSharp);
                this.quadraticCurveTo(...Math.midPoint(pSharp, arrowEnd, ratioLength, rationHeight), ...arrowEnd);

                pSharp = Math.rotate(Math.offsetPoint(p2, p1, arrowWidth), pi * 1.3, p2);
                this.quadraticCurveTo(...Math.midPoint(arrowEnd, pSharp, 0.5, rationHeight * 0.5), ...pSharp);
                this.quadraticCurveTo(...Math.midPoint(pSharp, p2, ratioLength, -rationHeight * 0.8), ...p2);

                this.linkDots(...curves[1].reverse());

                this[type || 'fill']();
            };
        if (animate) {
            Progress.watch(draw, config)
        } else {
            draw(1);
            done();
        }
    }
});

CanvasRenderingContext2D.aliasMethods({
    beginPath: 'begin',
    clear: 'clean',
    drawPoint: 'ball'
});
