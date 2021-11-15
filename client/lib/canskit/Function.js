import Code from './Code.js';

Function.extendMethods({
    with (...args) {
        return (...sth) => this(...args, ...sth)
    },
    withMomo (...args) {    // Ignore other parameters monopolize
        return () => this(...args)
    },
    after (interval, ...args) { // CALL it after `initerval`
        return new Promise(finish => {
            setTimeout(() => {                
                finish(this(...args))
            }, interval)
        })
    },
    immediate (...args) {
        return new Promise(finish => {
            setImmediate(() => finish(this(...args)))
        })
    },
    async atLeast (minDuration, ...args) {  // RETURN it after `minDuration`
        const start = Date.now()
        const data = await this(...args)
        const duration = Date.now() - start
        return new Promise(response => {
            setTimeout(response, minDuration - duration, data)
        })
    },
    delay (interval, sth) {
        return () => { 
            setTimeout(this, interval)
            return sth 
        }
    },
    pipe (...funcs) {	// func1.pipe(func2).pipe(func3)  ==>  func1.pipe(func2, func3) === Code.pipe(func1, func2, func3)
        return Code.pipe(this, ...funcs);
    },
    compose (...funcs) {
        return Code.compose(this, ...funcs);
    },
    repeat (times, ...args) {
        const results = [];
        for (let i = 0; i < times; i++) {
            results.push(this(...args));
        }
        return results;
    },
    thisRepeat (argThis, times, ...args) {
        return this.bind(argThis).repeat(times, ...args);
    },
    iterate (thisArg, ...argList) {
        return argList.map(args => this.apply(thisArg, args));
    },
    callEach (...argList) {
        return this.iterate(null, ...argList.wrapped());
    },
    ofTypes (...types) {
        return function (...args) {
            const newArgs = [];
            types.each(type => newArgs.push(args.popWhere(i => typeof i === type )) );
            newArgs.push(...args);
            return this(...newArgs);
        }.bind(this);
    },
    curry (...args) {
        // return Code.curry(this, ...args);
        return this.bind(this, ...args);
        /* function test (a, b, c) {
               console.log(`a + b + c = ${a + b + c}`);
               return a + b + c;
           }
           test.curry(1)(2)(3)
        */
    },
    only (n) {
        return Code.only(this, n);
    },
    soon (...args) {
        setImmediate
        setTimeout(this, 5, ...args);
    },
    timeLimit (interval, def) {
        return Code.timeLimit(this, interval, def);
    },
    later (obj, time, ...args) {
        setTimeout(this.bind(obj, ...args), time);
    },
    
    //TODO: https://underscorejs.org/#throttle
    debounce ({ wait, immediate = false }) {
        let next;
        const fn = (...args) => {
            if (immediate) {
                immediate = false;
                return this(...args);
            }
            fn.cancel();
            next = setTimeout(this, wait, ...args);
        };
        fn.cancel = () => clearTimeout(next);
        return fn;
    },

    throttle ({ wait = 600, leading = true, trailing = false } = {}) {
        trailing = trailing || !leading;    // Should not both false

        let next, last, need = leading, args;

        const fn = (...xxx) => {
            args = xxx;
            last = last || Date.now();
            const waited = Date.now() - last;

            const invoke = () => {
                last = Date.now();
                need = next = false;
                return this(...args);
            };

            if (need) {
                return invoke();
            }

            if (trailing) {
                next = next || setTimeout(invoke, wait - waited);
            } else if (waited >= wait) {
                return invoke();
            }
        };

        fn.cancel = () => {
            clearTimeout(next);
            last = next = undefined;
        };
        return fn;
    },
    throttleBind ($this, option) {
        return this.bind($this).throttle(option)
    },
    partial (...args) {
        return Code.partial(this, ...args);
    },

    asc (minLength = 2, defValue = 0) {
        return (...args) => {
            const lack = minLength - args.length;
            (lack > 0) && args.push(...defValue.duplicate(lack));
            return this(...args.ascending());
        }
    },
    times (count, from = 0) {
        return Number.rangedList(from, count + from - 1).map(this.unary);   // or not unary?
    },
    accumulate (from, to) {         //∑ =>  f(from) + f(from + 1) + f(from + 2) + f(from + 3) + ... + f(to)
        return Number.rangedList(from, to).map(this).sum();
        // return Number.rangedList(...arguments).reduce((accumulator, i) => accumulator + this(i), 0);
    },
    delay (ms) {
        console.log('delay', ms);
        return (...args) => setTimeout(this, ms, ...args);
    },
    withArgs (...args) {
        return this.bind(null, ...args);
    },
    time (...args) {
        console.time(this.name);
        const res = this(...args);
        console.timeEnd(this.name);
        return res;
    },
    testTime (times = 10**4, name = this.name || 'test') {
        return (arg, ...args) => {
            name.start(name.length + 2);
            if (arg.isFunc) {
                for (let i = 0; i < times; i++) {
                    this(arg(...args));
                }
            } else {
                for (let i = 0; i < times; i++) {
                    this(arg, ...args);
                }
            }
            name.done();
            console.log({ times });
        }
    },
    // 2020.12.23      Make sure to excute the function before `timestamp` 
    waitMax ({ timestamp = 1000, args = [] } = {}) {
        let called = false 
        const fn = (...sth) => {
            if (!called) {
                called = true 
                this(...sth)
            }
        }
        setTimeout(() => {
            if (!called) {
                called = true
                this(...args)
            }
        }, timestamp)
        return fn 
    },
    memorized () {
        return Code.memorized(this);
    },
    clearAllCache () {
        return Code.clearAllCache(this)
    },
    unmemorize (...key) {
        return Code.unmemorize(this, ...key)
    }
});

Function.aliasMethods({
    pipe: 'next'
});
Function.gets({
    unary () {
        return Code.unary(this);
    },
    reversed () {
        return (...args) => this(...args.slice(0, this.length).reverse());
    },
    once () {
        return Code.once(this);
    },
    rest () {
        return args => this(...args);
    }
})



Function.assign({
    identity: i => i,
    valueEquals: value => i => i === value,
    propertyEquals: (property, value) => i => i[property] === value,     //A "=" function for find
    nothing: () => undefined,
    exec (...argsAndCode) {
        /*
        Function.exec({ currentSite: "home-site", title: "用户消息" }, 
                      { url: "talk-app" }, 
                      'url === currentSite ? 'current' : ""') =>
        function anonymous({ url, title, currentSite }) {
            return url === currentSite ? 'current' : '' 
        }
        return anonymous({url: "talk-app", title: "用户消息", currentSite: "home-site"})
        */
        let code = argsAndCode.pop(),
            args = Object.assign({}, ...argsAndCode)
        // console.log({ args })
        if (!code.includes('return')) {
            code = `return ${code}`
        }
        const fn = new Function (`{ ${args.keys().join(', ')} } = {}`, code)
        return fn(args)
    }
})
