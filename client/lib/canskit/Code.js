const Code = {
    _: {},
    once (fn) {
        let invoked = false;
        return (...args) => {
            invoked = invoked || fn(...args) || true;
        };
    },

    everyOnce (fn) {            // Every different arguments will executed only once, like loading script library files
        const invoked = {};     // invoked = [];
        return (...args) => {
            const key = args.jsonString();
            // invoked.excludes(key) && invoked.push(key) && fn(...args); []
            invoked[key] = (key in invoked) || fn(...args) || true;
        };
    },

    everyArgOnce (fn) {         // func(a, b, c) => fn(a), fn(b), fn(c)
        const once = this.unary(this.everyOnce(fn));
        return (...args) => args.each(once) ;
    },

    memorized (fn) {          // Save HTML file?
        fn.cache = fn.cache || new Map();
        if (fn.isa('AsyncFunction')) {
            fn.fetching = fn.fetching || new Set();         //Cache the request
            const event = new EventTarget();
            return async (...args) => {
                const key = args.jsonString();
                const cached = fn.cache.get(key);
                if (cached) {
                    return cached;
                }
                if (fn.fetching.has(key)) {
                    return await event.waitFor(key);
                }
                fn.fetching.add(key);
                const value = await fn(...args);
                fn.cache.set(key, value);
                event.emit(key, value);
                fn.fetching.delete(key);
                return value;
            }
        } else {
            const dest = (...args) => {
                const key = args.jsonString();
                // fn.cache.has(key) || fn.cache.set(key, fn(...args));
                if (fn.cache.has(key)) {
                    console.log(`%c=> Cached ${fn.name} ${key}`, 'color: #666')
                } else {
                    fn.cache.set(key, fn(...args))
                }
                return fn.cache.get(key);
            }
            dest.$source = fn 
            return dest
        }
    },
    clearAllCache (dest) {
        dest.$source?.cache?.clear()
    },
    unmemorize (dest, ...args) {
        const fn = dest.$source
        console.log(`%c Unmemorized => ${args.jsonString()}`, 'color: #fff4')
        fn.cache?.delete(args.jsonString())
    },
    timeLimit (asyncFunc, interval, defValue) {     // asyncFunc means it returns a Promise
        return (...args) => {
            const timeoutPromise = (time, value) => new Promise(resolve => setTimeout(resolve, time, value));
            return Promise.race([asyncFunc(...args), timeoutPromise(interval, defValue)]);  // A promise
        }
    },

    zip (...args) {       // (array1, array2, array3, ...arrayN, fnZip)
        const fnZip = args.pop(), arrayList = args;
        const minLength = Math.min(...arrayList.pluck('length'));
        const result = [];
        for (let i = 0; i < minLength; i++) {
            result.push(fnZip(...arrayList.nthElements(i)));
        }
        return result;
    },
    zip2 (...args) {            // default value
        const fnZip = args.pop();
        this.zip(...args.filledArray(), fnZip);
    },

    curry (fn, ...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        } else {
            return (...argsNext) => this.curry(fn, ...args.concat(argsNext));
        }
    },

    partial: (fn, ...args) => function (...argsNext) {		//Don't recursive, just for one time, only the prev arguments, TODO: for more times
        const newArgs = args.cloned();//[...args];
        newArgs.each((value, i) => value === undefined && (newArgs[i] = argsNext.shift())); //replace undefined to __ ?
        return fn.call(this, ...newArgs, ...argsNext);
    },

    pipe: (...funcs) => function piping (...args) {
        if (args.length < funcs[0].length) {        //curry!!, arguments maybe more than 1!
            return (...argsNext) => piping(...args, ...argsNext);
        } else {
            return funcs.reduce((value, fn, index) => fn(...(index ? [value] : value)), args);
        }
    },

    compose (...funcs) {
        return this.pipe(...funcs.reverse());
    },

    seq: (...funcs) => (...args) => funcs.map(func => func(...args)),

    fork: (join, funcs) => (...args) => join(...Code.seq(...funcs)(...args)),

    //let avg = fork(divide, [sum, count])(90, 92, 100) => 94    Means converge

    useWith: (join, funcs) => (...args) => {
        if (args.length < funcs.length) {
            return (...argsNext) => Code.useWith(join, funcs)(...args, ...argsNext);
        } else {
            return join(...funcs.map(fn => fn(args.shift())));
        }
    },

    only: (fn, n) => (...args) => fn(...args.left(n)),    //Only n argument, e.g Number.parseInt

    unary: fn => Code.only(fn, 1),

    sum: (...args) => args.map(Number.parseFloat).reduce((a, b) => a + b, 0),       // ∑

    length: args => args.length,

    count: (...args) => args.length,

    complement: fn => (...args) => !fn(...args),

    tap: fn => (...args) => fn(...args) && false || args,

    maybe: (value, probability = 0.5, defaultValue = '') => Math.random() < probability ? value : defaultValue,

    ifndef: (value, defValue) => value !== undefined ? value : defValue,

    flip: arrayList => {
        // [[1, 2, 3], [5, 6, 7]]  flip => [[1, 5] ,[ 2, 6], [3, 7]]
        const res = [], length = arrayList[0].length;
        for (let i = 0; i < length; i++) {
            res.push(arrayList.select(i));      // select => pluck
        }
        return res;
    },
    
    sleep: seconds => new Promise(resolve => setTimeout(resolve, 1000 * Number.parseFloat(seconds)))

};

// For code statistics...
const Statistics = {};
// [Object, Array, Number, Function, String].map(Type => ({name: Type.name, prototype: Type.prototype}))
//     .concat({name: 'Code!', prototype: Code}, {name: 'Math', prototype: Math})
//     .each(({name, prototype }) => {
//         const log = Statistics[name] = {};
//         for (const func in prototype) {
//             const current = prototype[func], key = `${func} `;
//
//             if (current.isFunc) {
//                 prototype[func] = function (...args) {
//                     log[key] = (log[key] || 0) + 1;
//                     // console.log(`${name}:${func} => ${log[key]}`);
//                     return current.bind(this)(...args);
//                 }
//             }
//         }
//     });

({ Code, Statistics, X: Code }).globalize();
export default Code;