Object.prototype.assign = function (...properties) {
    return Object.assign(this, ...properties);
};
Array.prototype.assign({
    assembled () {
        return {}.assign(...this);
    },
    each (fn) {     // Array.prototype.each = Array.prototype.forEach;
        return this.forEach(fn) || this;
    }
});
// Function.prototype.flatten = function  () {
//     return args => this(...args);
// };
Object.defineProperty(Function.prototype, 'flatten', {
    get () {
        return args => this(...args);
    }
});

const _propertyCaches = {};
Object.prototype.assign({
    // isOwnerOf (key) {
    //     return this.hasOwnProperty(key);
    // },
    jsonString (...args) {
        return JSON.stringify(this, ...args);
    },
    jsonProps (...props) {
        props.each(prop => this[prop] = JSON.parse(this[prop]))
        return this
    },
    prettyLog () {
        console.log(JSON.stringify(this, null, 2))
    },
    keys () {
        return Object.keys(this);   //Object.getOwnPropertyNames(this); even not enumerable
    },

    values () {
        return Object.values(this);
    },

    entries () {
        return Object.entries(this);
    },
    filledAllKeys (...keys) {
        return this.picked(...keys).values().findIndex(value => !value) === -1
    },
    swap (a, b) {
        const aValue = this[a];
        this[a] = this[b];
        this[b] = aValue;
    },
    loop (fn) {     // Key first, then value
        return this.entries().each(fn.flatten) && this;
        // this.entries().each(key_value => fn.apply(this, key_value));
        // this.entries().each(([key, value]) => fn.call(this, key, value, this));
        // return this;
    },

    inside (...list) {
        list = list.flatted();
        for (let i = 0; i < list.length; i++) {
            if (list[i] === (this instanceof String ? String(this) : this)) {
                return true;
            }
        }
        return false;
    },

    cloned () {
        return this.jsonString().jsonObject();
    },

    affectless (method) {
        return this[method].bind(this.cloned());
    },

    findKey (value) {
        let key = undefined;
        this.loop((k, v) => (v === value) && (key = k));
        return key;
    },

    hasValue (value) {
        return this.values().includes(value);
    },

    picked (...keys) {
        const dest = {};
        keys.flatted().each(key => (key in this) && (dest[key] = this[key]));
        return dest;
    },

    assignKeys (source, ...keys) {
        this.assign(source.picked(...keys));
    },

    assignName (property = 'id') {          // variable's name
        //({format, alpha, beta}).loop((name, value) => value.id = name);
        return this.loop((key, obj) => obj[property] = key);
    },

    fn () {
        return this;
    },

    boundMethod (funcName, ...args) {
        return this[funcName].bind(this, ...args);
    },

    duplicate (count, deep = false) {             //shallow duplicate
        return deep ? 'cloned'.bind(this).times(count) : Array(count).fill(this);
    },

    globalize () {
        return window.assign(this);
    },

    globalizeProperties () {    // Replace `window` to `global` in node.js
        const cache = _propertyCaches[this.toString()] = {};
        Object.getOwnPropertyNames(this).each(property => property.assignLeft(cache, window, this) );
    },

    clearGlobalProperties () {
        const cache = _propertyCaches[this.toString()];
        Object.getOwnPropertyNames(this).each(property => {
            property.assignLeft(window, cache);
            window[property] === undefined && delete window[property];
        });
        delete _propertyCaches[this.toString()];
    },

    namespace (fn, ...args) {   // For Math, Code...
        return [this].namespace(...arguments);
    },

    isArray() {
        return Array.isArray(this);
    },

    assignList (...args) {
        const valueList = args.pop();
        args.each(property => this[property] = valueList.next());
    },

    // defaultValue (key, value) {
    //     (key in this) || (this[key] = value);
    //     return this[key];
    // },

    equals (obj) {
        return this.jsonString() === obj.jsonString();
    },

    containsObject (obj) {      // Should not has undefined properties
        if (!(obj.isObject && this.isObject)) {
            return false;
        }
        return this.equals(this.cloned().assign(obj));
    },

    each (fn) {         //If not array, then...     [fn(this, 0)]
        return (this.forEach ? this : [this]).forEach(fn);
    },

    array () {  // document.querySelectorAll(...).array()
        return Array.from(this);
    },

    own (name) {
        const data = this[name];
        return (data && data.isFunc) ? data.bind(this) : data;
    },

    defValue (key, value) {
        this[key] = this.hasOwnProperty(key) ? this[key] : value;
    },

    probe (name, substitution = 0) {
        return (this[name] !== undefined ? this : this[substitution]).own(name);
    },

    callSoon (funcName, ...args) {
        this[funcName].bind(this).soon(...args);
        return this;
    },

    /** Belows are for Class Object, not instance, e.g Array, Object  **/
    aliasMethods (dict) {
        dict.loop((key, values) => values.each(value => this.prototype[value] = this.prototype[key]));
    },

    extendPrototypes (properties) {     // For Object's Class
        Object.defineProperties(this.prototype, properties);
    },
    extendMethods (prototype) {
        this.prototype.assign(prototype);
    },

    valueMap (fn) {
        const res = {};
        // this.entries().each(([key, value]) => res[key] = fn(value, key));
        this.loop((key, value) => res[key] = fn(value, key));
        return res;
        // return this.entries().map(([key, value]) => ({[key]: fn(value, key)})).assembled();
    },
    gets (source) {                 // For Getting only
        this.extendPrototypes(source.valueMap(property => ({get: property})));
    },

    isa (type) {
        if (type.constructor === String) {
            return this.constructor.name.toLowerCase() === type.toLowerCase();
        } else {
            return this.constructor === type;
        }
    },

    later (funcName, time, ...args) {
        setTimeout(this.own(funcName), time, ...args);
    },

    hasFunction (name) {
        return (this[name] || true).isa('Function');
    },

    oppositeFunc (funcName) {
        return this.boundMethod(funcName).opposite;
    },
    depro (name, ...args) {
        Object.defineProperty(this, name, ...args);
    },
    defineProperties (name, props) {
        Object.defineProperties(this, name, props);
    },
    alias (currentName, newName) {
        this.depro(newName, {
            get () { return this[currentName] },
            set (value) { this[currentName] = value }
        });
    },
    aliasProperties (dict) {
        dict.loop((current, newNames) => newNames.each(newName => this.alias(current, newName)))
    },
    
    repeat (n) {
        return Array.repeat(this, n);
    },
    maybe (fnName, ...args) {   // try invoking
        this[fnName] && this[fnName](...args);
    },
    output () {
        console.log(this);
    },
    kvReversed () {
        const obj = {}
        this.loop((k, v) => obj[v] = k)
        return obj
    },
    oneOf (...list) {
        return list.includes(this)
    }
});
Object.gets({

    isFunc () {
        return typeof this === 'function';
    },

    self () {
        return this;
    },

    propertyNames () {
        return Object.getOwnPropertyNames(this);
    },
    /** Below can use proxy? But only for new class, not the existed (Object, Array, Number...) **/

    isObject () {               //Not array
        return this.isa(Object);//this instanceof Object && !Array.isArray(this);
    },
    isString () {
        return this.isa(String);
    },
    isNumber () {
        return this.isa(Number);
    },
    isList () {    
        return this.isa(Array)
    },
    condition () {      //for where
        if (this.isFunc) {
            return this;
        }
        return value => {
            if (value.isObject && this.isObject) {
                return value.containsObject(this);
            } else {
                return value === this;
            }
        };
    },
    opposite () {
        return  (...args) => !this.condition(...args);
    },
    always () {
        return () => this;
    },
    outside () {
        return this.oppositeFunc('inside');
    },
    $css () {
        return this.keys().map(key => `--${key}: ${this[key]};`).join('')
    }
});

// let o = Object.create(null);   won't have these prototypes and properties(get)
// Object.setPrototypeOf(a, b)
// set a's prototype to b, and can dynamically changed from b.  a.assign(b) won't be changed after b is changed
// Object.getPrototypeOf(a) === b
// Object.getOwnPropertyNames => Including the not enumerable keys
/*
    Whereas the property descriptor getter/setters needs to know the name of a property ahead of time(previously)
    Proxy needs not!
 */


Array.assign({
    confirm: obj => Array.isArray(obj) ? obj : [obj],                   //Make sure it's an array
    sure: array => Array.isArray(array[0]) ? array[0] : array,    //Make sure not an array of array
});
Array.aliasMethods({
    find: 'which',
    filter: 'where'
});

Storage.extendMethods({
    valuesOf (key) {
        return this.defaultValue(key, '').split(this.splitter).compact();
    },
    saveValues (key, valueList) {
        this[key] = valueList.join(this.splitter);
    },
    add (key, value) {                  //Add to the first
        const valueList = this.valuesOf(key);
        valueList.prepend(value.trim());
        this.saveValues(key, valueList);
        return this;
    },
    prev (key) {            //It's the last value
        const lastValue = this.valuesOf(key).last();
        lastValue && this.add(key, lastValue);
        return lastValue;
    },
    next (key) {
        const valueList = this.valuesOf(key);
        valueList.moveFirstToLast();
        this.saveValues(key, valueList);
        return valueList[0];
    },
    plus (key, n = 1) {
        this[key] = (Number.parseInt(this[key]) || 0) + 1;
    }
});
Storage.extendPrototypes({
    splitter: {
        get () {
            return this.__splitter || '\n';
        },
        set (value) {
            this.__splitter = value;
        }
    }
});