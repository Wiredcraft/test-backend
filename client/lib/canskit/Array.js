import Code  from './Code.js';

// Array.gets({
//     someUndefined () {
//         return this.some(i => i === undefined);
//     },
// });

// (?:\n)    \w+ \(

Array.extendMethods({

    last () {
        return this[this.length - 1];
    },
    butLast () {
        return this.slice(0, this.length - 1)
    },
    lastList (n = 1) {
        return n >= this.length ? this : this.slice(this.length - n);
    },

    uniq () {
        return Array.from(new Set(this));
    },
    allUniq () {
        return this.length === this.uniq().length;
    },

    map1 (fn) {
        return this.map(fn.unary);
    },
    members (...indexes) {
        return indexes.map(i => this[i]);
    },
    next () {
        this.defaultValue('current', 0);
        if (this.current >= this.length)
            this.current -= this.length;
        return this[this.current++];
    },

    prev () {
        this.defaultValue('current', 0);
        if (this.current <= 0)
            this.current += this.length;
        return this[--this.current];
    },

    left (n = 1) {
        return this.slice(0, n);
    },
    pluck (key = Object.keys(this[0] || {})[0]) {       //Equals _.map in Lodash
        return this.map(row => row[key]);
    },
    pluckKeys (...keys) {
        return this.map(row => {
            const result = {}
            for (let prop in row) {
                if (keys.includes(prop)) {
                    result[prop] = row[prop]
                }
            }
            return result
        });
    },
    
    groups (prop) {
        const result = {};
        this.each(item => {
            const key = item[prop];
            if (!(key in result)) {
                result[key] = [];
            }
            result[key].push(item);
        });
        return result;
    },
    
    anyone () {
        return this[this.length.randomInt()];
    },
    divide (n) {
        let current, length = this.length;
        for (let i = 0; i < length; i++) {
            if (i % n === 0) {
                current = [];
                this.push(current);
            }
            current.push(this.shift());
        }
        return this;
    },
    flatten (deep = false) {
        const list = [];
        this.each(item => {
            if (Array.isArray(item)) {
                list.push(...(deep ? item.flatten(deep) : item))
            } else {
                list.push(item);
            }
        });
        return list;
        // if (!deep) {
        //     return this.flat();     //By native, but maybe not supported~~
        // }
        // const list = [];
        // this.each(item => {
        //     if (Array.isArray(item)) {
        //         item.flatten(deep).each(i => list.push(i));
        //     } else {
        //         list.push(item);
        //     }
        // });
        // return list;
    },

    flatted () {
        // [['left', 'down'], 'up'].flat() => ["left", "down", "up"]
        // [['left', 'down'], 'up'].flatted() => ["left", "down"]
        return (this[0] instanceof Array) ? this[0] : this;
    },

    clean () {
        return this.splice(0);
    },

    reject (fn) {
        return this.filter(Code.complement(fn));
        // return this.without(this.filter(fn));
    },

    toggle (value) {
        if (this.includes(value)) {
            this.remove(value);
        } else {
            this.push(value);
        }
        return this;
    },

    findLastIndex (fn) {
        const index = this.cloned().reverse().findIndex(fn);
        return index >= 0 ? this.length - index - 1 : -1;
    },

    popWhere (where, fromEnd) {          //Only one, return the popped value
        const index = this[fromEnd ? 'findLastIndex' : 'findIndex'](where.condition);  // "where" can be a value
        return index >= 0 ? this.removeAt(index) : undefined;
    },

    removeAt (index) {
        return this.splice(index, 1)[0];        //splice => change this,  slice => new array(shallow copy)
    },

    remove (obj) {
        let index = this.indexOf(obj);
        if (index >= 0) {
            this.removeAt(index);
            return true;
        } else {
            return false;
        }
    },

    nthElements (n) {     // for array of arrays
        return this.map(a => a[n]);
    },

    pops (n = 1) {
        return this.splice(-n, n);
    },
    shifts (n = 1) {
        return this.splice(0, n);
    },

    pushStart (...values) {
        this.unshift(...values);
        return this;
    },
    pushEnd (...values) {
        this.push(...values);
        return this;
    },

    swap (n, m) {       // Change this
        const temp = this[n];
        this[n] = this[m];
        this[m] = temp;
        return this;
    },
    swapped (n, m) {      // Not change this
        return this.affectless('swap')(n, m);
    },

    move (from, to = 0) {
        const [value] = this.splice(from, 1);
        this.insertAt(to, value);
        return this;
    },

    prepend (value) {       // Like unshift, but won't repeat and move to first if existed
        const index = this.indexOf(value);  //findIndex(e => e.equals(value));//
        if (index >= 0) {
            this.move(index);
        } else {
            this.unshift(value);
        }
        return this;
    },

    moveFirstToLast () {
        return this.move(0, this.length);   //=== this.push(this.shift());
    },

    // cloned () {
    //     return [...this];       //this.slice(0);
    // },
    assignArray (array) {
        for (let i = 0; i < array.length; i++) {
            this[i] = array[i];
        }
        return this;
    },
    filledArray (update = true) {
        // [                       [
        //     [1, 2, 3],              [1, 2, 3],
        //     [3, 4],     =>          [3, 4, 3],
        //     [5]                     [5, 2, 3]
        // ]                       ]
        const list = update ? this : this.cloned();
        const longest = this.longest();
        const maxLength = longest.length;
        list.each( array => maxLength > array.length && array.push(...longest.slice(array.length)) );
        return list;
    },

    longest () {
        const maxLength = Math.max(...this.pluck('length'));
        return this.find(Function.propertyEquals('length', maxLength));
    },

    removeWhere (where) {
        const removed = [];
        for (let i = this.length - 1; i >= 0; i--)
            where.condition(this[i]) && removed.push(this.removeAt(i));
        return removed;
    },
    keepWhere (where) {
        return this.removeWhere(where.opposite);
    },
    which (condition) {
        return this.find(obj => {
            for (let [key, value] of Object.entries(condition)) {
                if (obj[key] !== value) {
                    return false;
                }
            }
            return true;
        })
    },
    replaceValues (to, where = true.always) {
        const removed = [];
        this.each((value, i) => {
            if (where.condition(value)) {
                removed.push(this[i]);
                this[i] = to;
            }
        });
        return removed;
    },

    insertAt (index, obj) {
        return this.splice(index, 0, obj) && this;
    },

    excludes (item) {
        return !this.includes(item);
    },
    without (...exclusion) {
        return this.filter(item => exclusion.flatten().excludes(item));
    },

    compact () {
        return this.without(false, null, 0, '', undefined, NaN);
    },

    defValue (def = 0) {
        return this.map(i => i || def);
    },

    except (...exclusion) {
        return this.without(...exclusion).anyone();
    },

    randomItems (length = this.length, { unique = true } = {}) {
        let newList = [];
        for (let i = 0; i < length; i++)
            newList.push(this.except(unique ? newList : undefined));
        return newList.compact();
    },
    randomSorted () {   // Will return a new
        return this.randomItems(this.length, { unique: false });      // = this.randomItems(this.length, { unique: true })
    },

    pushEach (fnCreate, count) {
        for (let i = 0; i < count; i++)
            this.push(fnCreate(i));
    },

    properties (propertyName) {
        //     this.map(item => item[propertyName]);
        return this.map(propertyName.prop);
    },

    setEach (propertyName, values) {
        values = Array.confirm(values);
        this.each((item, i) => item[propertyName] = (values.length > i ? values[i] : values.last()));
    },

    namespace (fn, ...args) {   //[Math, Object].namespace(i => console.log(sin, assign, is, i), 'I am i')
        this.each(obj => obj.globalizeProperties());
        const res = fn.apply(this, args);
        this.each(obj => obj.clearGlobalProperties());
        return res;
    },

    zip (fn) {
        /*
            [[alpha, beta], [a, b]].zip((element, value) =>
            element.setAttribute('data-value', value.round()) );
                        ||          ||
            alpha.setAttribute('data-value', a.round());
            beta.setAttribute('data-value', b.round());
         */
        return Code.zip(...this, fn);
    },

    trim: function (test = '') {
        const copied = this.cloned();
        let equal = (a, b) => b.hasFunction('test') ? b.test(a) : a === b;      //Maybe RegExp
        while (copied.length && equal(copied.first, test)) copied.shift();
        while (copied.length && equal(copied.last,  test)) copied.pop();
        return copied;
    },
    sum () {
        return Code.sum(...this);
    },
    pushNew (obj) {
        if (!this.includes(obj)) {
            this.push(obj)
            return true
        } else {
            return false
        }
    },
    flip () {
        // [[1, 2, 3], [5, 6, 7]]  flip => [[1, 5], [2, 6], [3, 7]]
        return Code.flip(this);
    },

    fZip (fn) {
        return this.flip().zip(fn);
        /*
            [[alpha, a], [beta, b]].fZip((element, value) => element.setAttribute('data-value', value.round()) );
                    ||
            [[alpha, beta], [a, b]].zip( (element, value) => element.setAttribute('data-value', value.round()) );
                    ||
            alpha.setAttribute('data-value', a.round());
            beta.setAttribute('data-value', b.round());
         */
    },

    fillValues (value, ...args) {
        args.each(arg => {
            const index = this.indexOf(value);
            index >= 0 && (this[index] = arg);
        });
        return this;
    },
    fillUndefined (...args) {
        // [undefined, 1, 2, undefined, undefined].fill(5, 6) => [5, 1, 2, 6, undefined]
        // Function.fillUndefined ... => curry
        return this.fillValues(undefined, ...args);
    },

    assignItemProperty (property, values) {
        this.each((item, i) => item[property] = values[i]);
    },

    wrapped () {
        return this.map(i => [i]);
    },

    invoke (methodName, ...args) {    //[fillSwitch, factor].invokeMethod('toggleEnable');
        return this.map(i => i[methodName](...args));
    },

    // Union, Intersect, Difference, also useful for functions?
    union (another) {
        return [...new Set([...this, ...another])];
    },
    intersect (another) {
        return this.uniq().filter(i => another.includes(i));
    },
    diff (another) {                // [1, 2, 3].diff([4, 3, 2]) => [1]
        return this.uniq().filter(i => another.excludes(i));
    },
    symmetricalDiff (another) {     // [1, 2, 3].symmetricalDiff([4, 3, 2]) => [1, 4]
        return this.union(another).without(this.intersect(another));
    },
    toObject () {
        // return Object.fromEntries(this);   =>  Chrome 73+
        const object = {};
        this.each(([key, value]) => object[key] = value);
        return object;
    },

    ascending () {
        return this.sort((a, b) => a - b);  // this is updated
    },
    descending () {
        return this.sort((a, b) => b - a);  // this is updated
    },
    sortBy (field, order = 'asc') {
        return this.sort((a, b) => (a[field] - b[field]) * (order === 'asc' ? 1 : -1));
    },
    equal (list, test = (a, b) => a === b) {
        if (this.length !== list.length) {
            return false;
        }
        for (let i = 0; i < this.length; i++) {
            if (!test(this[i], list[i])) {
                return false;
            }
        }
        return true;
    },
    evalLoop (fn) {     // Like Lisp
        return eval(`const result = [];${this.length.times(n => `for (let _${n} = 0; _${n} < ${this[n]}; _${n}++) `).join('')} result.push(fn(${ this.length.times(n => `_${n}`).join(',') })); result`);
        // return eval('const result = [];' + this.length.times(n => `for (let _${n} = 0; _${n} < ${this[n]}; _${n}++) `).join('') + `result.push(fn(${ this.length.times(n => `_${n}`).join(',') })); result`);
        // let length = this.length, result = [], codes = length.times(n => `for (let _${n} = 0; _${n} < ${this[n]}; _${n}++) {\n${'  '.repeat(n + 1)}`).join('');
        // codes += `result.push(fn(${ length.times(n => `_${n}`).join(',') }));\n`;
        // codes += length.times(n => '  '.repeat(length - n - 1) + '}').join('\n');
        // console.log(codes);
        // eval(codes);
        // return result;
    },
    recursiveLoop (fn) {
        const temp = this.cloned();
        const data = temp.shift().times(temp.length ? n => temp.recursiveLoop((...args) => fn(n, ...args)) : fn);
        return temp.length ? data.flat() : data;
    },
    linearLoop (fn) {
        const sum = this.reduce((a, b) => a * b, 0);
        return sum.times(n => {
            let args = [], left = n, list = this.cloned();
            this.each(() => {
                 const value = list.pop();
                 args.unshift(left % value);
                 left = (left / value).floor();
            });
            return fn(...args);
        });//.map(fn.rest);
    },
    popAny () {
        return this.splice(this.length.randomInt(), 1)[0];
    },
    setTo (array) {  //Update the array's data
        this.splice(0, this.length, ...array);
        return this;
    },
    frontPart (ratio) {
        return this.slice(0, Math.floor(this.length * ratio));
    },
    endPart (ratio) {
        return this.slice(Math.ceil(this.length * (1 - ratio)));
    },
    // randomize (repeatable) {
    //     let temp = [];
    //     this.length.times(n => temp.push(this[repeatable ? 'any' : 'popAny']()));
    //     return this.setTo(temp);
    // }
});
window.a = [1, 2, 3, 4]
Object.extendMethods({
    last () {
        return this.array().last();
    }
});
Array.aliasMethods({
    pluck: 'select',
    removeAt: 'popAt',
    anyone: 'any'
});
Array.assign({
    repeat: (x, n) => new Array(n).fill(x)
});
Set.aliasMethods({
    forEach: 'each',
});
Set.extendMethods({
    filter (fn) {
        return new Set([...this].filter(fn));
    },
    map (fn) {
        // return new Set([...this].map(fn));   //Same as:
        return new Set(Array.from(this, fn));
    }
});
// WeakSet is only used for maybe recycled objects
Map.assign({
    from (obj) {        // const m = Map.from({a: 'apple', b: 'boy})
        return new Map(obj.entries());
    },
});
Map.extendMethods({
    toObject () {
        const object = {};
        for (let [key, value] of this.entries()) {
            object[key] = value;
        }
        return object;
        // return this.entries().toObject() not work
    },
});





