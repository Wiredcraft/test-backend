window.FrameRate = 60;

window.KeyShortcuts = {
    enter: 13,
    // return: 13,
    esc: 27,
    left: 37,
    up: 38,
    top: 38,
    right: 39,
    down: 40,
    bottom: 40,
    space: 32
};
// document.documentElement === <html />

const GradientRate = rate => Math.sin((rate - 0.5) * pi) / 2 + 0.5;
window._ = () => {};
const CSSFont = ['font-size', 'font-family', 'font-style', 'font-weight'],
      CSSPadding = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'/*, 'margin'*/];

// EventEmitter.prototype.onceAsync = async function (event) {
//     return new Promise(resolve => this.once(event, resolve));
// };
// EventEmitter.prototype.onAsync = async function (event) {
//     return new Promise(resolve => this.on(event, resolve));
// };
Event.gets({
    nearest () {
        return this.composedPath()[0];
    },
    thePath () {
        return this.path || this.composedPath()
    }
});

Event.extendMethods({
    findTag (tag) {
        return this.thePath.find(sth => sth.tagName === tag.toUpperCase())
    }
})
EventTarget.extendMethods({     // EventTarget including Window

    on (events, fn) {
        events = events.split(/\s+/);
        events.each(event => {
            this.addEventListener(event, fn, false);
            (event in KeyShortcuts) && this.onKey(event, fn);
        });
        return this;
    },
    query (selector) {
        return this.querySelector(selector)
    },
    queryAll (selector) {
        return Array.from(this.querySelectorAll(selector))
    },
    $ (selector) {
        return this.shadowRoot.querySelector(selector) // this.ownerDocument.querySelector(selector);
    },
    $$ (selector) {
        return Array.from(this.shadowRoot.querySelectorAll(selector)) //this.ownerDocument.querySelectorAll(selector).array();
    },
    off (events, fn) {
        events = events.split(/\s+/);
        events.each(event => {
            this.removeEventListener(event, fn);
            this.keyEvents?.[event]?.delete(fn);
        });
        return this;
    },
    
    onKey (event, fn) {
        if (!this.keyEvents) {
            this.keyEvents = {};
            this.on('keydown', e => {
                const eventName = KeyShortcuts.findKey(e.keyCode);
                if (eventName && this.keyEvents[eventName]) {
                    this.emit(eventName);
                    e.preventDefault();
                }
            });
        }
        this.keyEvents[event] = this.keyEvents[event] || new Set();
        this.keyEvents[event].add(fn);
    },

    once (event, fn) {
        this.addEventListener(event, fn, { once: true });
    },

    childrenClicked (selector, handler) {
        this.on('click', e => {
            if (e.nearest.is(selector)) {
                handler(e.nearest);
                e.stopPropagation()
            }
        })
    },

    waitFor (event) {
        return new Promise(resolve => this.once(event, resolve));
    },

    emit (event, detail, { bubbles = false, composed = true } = {}) {   // if bubbles, it will repeat?
        this.dispatchEvent(new CustomEvent(event, { detail, bubbles, composed }));
        return this;
    },

    enter (fn) {
        return this.on('enter', fn);
    },
    ctrlEnter (callback) {
        this.on('keydown', e => {
            if (e.keyCode === KeyShortcuts.enter && (e.ctrlKey || e.metaKey)) {
                return callback(e);
            }
        });
    },
    press (char, callback) {
        return this.on('keydown', e => {
            if (e.keyCode === char.toUpperCase().charCodeAt()) {
                return callback(e);
            }
        });
    },
    esc (fn) {
        return this.on('esc', fn);
    },
    
    find (selector) {
        return new Proxy((this.shadowRoot || this).querySelectorAll(selector).array(), {
            get (target, name) {
                return target.probe(name, 0);
            },
            set (target, prop, value) {
                target[0][prop] = value;
                return true;
            }
        });
    }
});

HTMLElement.extendMethods({
//============================================= Styles/Animation =================================================================//
    setStyle (style, unit) {
        if (unit) {
            style.loop((key, value) => {
                if (value.isNumber || value.isFloat) {
                    style[key] = value + unit;
                }
            });
        }
        this.style.assign(style);
        return this;
    },

    css (key, value) {
        if (value === undefined) {
            return this.computedStyles[key];
        }
        return this.setStyle({[key]: value});
    },
    copyStyle (dest, { styles = ['width',  'color', 'line-height', 'left', 'top', 'position', 'text-transform', 'letter-spacing', ...CSSFont, ...CSSPadding], exception = [] } = {}) {
        if (dest.isString) {
            dest = this.$(dest);
        }
        styles.each(style => exception.includes(style) || this.css(style, dest.css(style)));
        return this;
    },
    fixTo (selector) {
        return this.setStyle({
            position: 'fixed',
            left: this.screenRect.left,
            top: this.screenRect.top,
            margin: 0
        }, 'px').appendTo(selector);
    },
    fixToBody () {
        return this.fixTo('body');
    },
    cssVar (key, value) {
        if (typeof key === 'object' && !value) {
            return this.setCssVars(key)
        }
        key = '--' + key.replace(/^--/, '')
        if (value !== undefined) {
            this.style.setProperty(key, value);
            return this;
        } else {
            return this.computedStyles.getPropertyValue(key).trim() ;
        }
    },
    cssVars (obj, unit = '') {
        obj.entries().each(([key, value]) => this.cssVar(key, value + unit));
    },
//===============================================================================================================================//
    
    
    clickChild (selector) {
        return this.find(selector).emit('click');
    },

    attr (key, value, defValue = null) {
        if (value !== undefined) {
            this.setAttribute(key, value);
            return this;
        } else {
            value = this.getAttribute(key) || defValue;
            if (key.match(/^\w{1,2}id$/) && value?.isInt) {
                value = Number.parseInt(value)
            }
            return value
        }
    },
    attrs () {
        return this.attributes.array()
                   .map(({name, value}) => ({[name]: value}))
                   .assembled();
    },

    removeAttr (...keys) {
        keys.each(key => this.removeAttribute(key));
        return this;
    },

    assignAttr (attrObj) {
        attrObj.loop(this.boundMethod('attr'));
        return this;
    },

  

    set (property, value) {
        if (property.isString && value !== undefined) {
            this[property] = value;
        } else if (property.isObject) {
            property.entries().each(([key, value]) => this[key] = value);
        }
        return this;
    },

    color (name = 'backgroundColor') {
        const colors = this.computedStyles[name].replace(/[^0-9 .]/g, '').split(' ').map(Number.parseFloat);
        if (colors[3] === undefined) {      // opacity
            colors[3] = 1;
        }
        return colors;  //[r, g, b, a]
    },

    addClass (classNames) {
        this.classList.add(...classNames.split(' '));
        return this;//Array.from(this.classList);
    },

    removeClass (classNames) {
        this.classList.remove(...classNames.split(' '));
        return this;//Array.from(this.classList);
    },
    replaceClass (from, to, insure = true) {
        if (!insure && !this.is(`.${from}`)) {
            return this
        }
        return this.removeClass(from).addClass(to)
    },
    toggleClass (className) {
        this.classList.toggle(className);
        return this;
    },
    keepClass (className, keep) {
        return this[keep ? 'addClass' : 'removeClass'](className)
    },
    afterSiblings () {
        const result = [];
        let node = this.nextElementSibling;
        while (node) {
            result.push(node);
            node = node.nextElementSibling;
        }
        return result;
    },
    oneselfClass (className = 'current') {    // Select this element and unselect its siblings
        return this.removeClass(className).toggleSelect(className);
    },
    siblings () {
        const result = [];
        let node = this.parentNode.firstChild;
        while (node) {
            if (node !== this && node.nodeType === Node.ELEMENT_NODE) {
                result.push(node);
            }
            node = node.nextElementSibling || node.nextSibling;
        }
        return result;
    },
    toggleSelect (className) {
        this.toggleClass(className)
            .siblings()
            .each(node => node.removeClass(className));
        return this;
    },
    singleSelect (className) {
        return this.removeClass(className).toggleSelect(className);
    },
    transit () {    // Need the global css
        return this.addClass('transition');
    },

    AnimationDone (callback) {      // callback maybe a string of function name
        setTimeout(callback.bind(this), this.cssVar('duration').toFloat() * 1000);
        return this;
    },

    zoomOut (larger = true, { callback = 'remove' } = {}) {
        this.transit().setStyle({
            opacity: 0,
            transform: `scale(${larger ? 1.2 : 0.85})`
        });
        return this.AnimationDone(callback);
    },

    popup () {
        //TODO: Show element(e.g color picker) based on the mouse, with and triangular arrow  Use Canvas!!? curved arrow?
        // document.elementFromPoint(x, y);
        // window.requestAnimationFrame/animate to sync the fade out
    },

    animateTo (keyframes, options = {}) {
        // keyframes: [{opacity: 0, color: 'white'}, {opacity: 1, color: 'black'}] or { opacity: [0, 1], color: ['white', 'black']}
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
        const defaultOptions = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards',
            endDelay: 400
        };
        this.animate(keyframes, defaultOptions.assign(options));    // Supports: Chrome/FireFox,  Safari DON'T, much less IE/Edge
    },

    fadeIn () {
        return this.transit().css('opacity', 0).callSoon('css', 'opacity', 1)
    },

    fadeOut (delay = 0) {
        setTimeout(() => this.addClass('fade-out'), delay * 1000)
        this.endAnimated('fade-out', () => this.remove())
    },
    endAnimated (name, callback) {
        this.on('animationend', e => {
            if (name === e.animationName) {
                callback(e)
            }
        })
    },
    animated (callback) {
        return this.on('animationend', callback);
    },
    flyin () {
        return this.addClass('fly-in');//.animated(() => this.removeClass('fly-in'));
    },

    flyout (callback = e => e.nearest.remove()) {
        return this.addClass('fly-out').animated(callback);
    },

    toggleEnable () {
        this.toggleAttribute('disabled');
    },

    disable () {
        this.setAttribute('disabled', 'disabled');
    },

    appendTo (parent) {
        if (parent.isString) {
            parent = this.$(parent);
        }
        parent.append(this);
        return this;
    },

    prependTo (parent) {
        if (parent.isString) {
            parent = this.$(parent);
        }
        parent.prepend(this);
        return this;
    },

    appendHTML (html) {
        this.insertAdjacentHTML('beforeEnd', html);
        return this.children.last();
    },
    prependHTML (html) {
        this.insertAdjacentHTML('afterBegin', html);
        return this.children[0];
    },
    goAfter (element) {     // For inserted child
        const next = element.nextSibling;
        next ? element.parentNode.insertBefore(this, next) : element.parentNode.append(this);
        return this;
    },
    insertAt (position, element) {
        this.insertAdjacentElement(position, element)
    },
    reveal (fadeIn = true) {
        fadeIn && this.fadeIn();
        return this.appendTo(this.doc.body);
    },

    twin () {
        const {x, y} = this.screenRect;
        const twin = this.cloneNode(true);     // The style relative to the content should be set to class instead of id
        // this.style.visibility = 'hidden';
        this.style.opacity = '0.0'; // 0.0 normally
        twin.origin = this;
        twin.id = (this.id || Math.random()) + '-flyer';
        this.doc.body.append(twin);
        twin.setStyle({
            position: 'absolute',
            margin: 0,
            transform: 'none',
            left: `${x + window.scrollX}px`,        // Use fixed instead?
            top : `${y + window.scrollY}px`,
            zIndex: 999
        });
        return twin;
    },
    fly (dest, { duration = this.cssVar('duration').toFloat(), withoutSiblings = true, direct = false, done = _ } = {}) {
        if (!dest) {
            dest = Array.from(this.$$(`*[tag=${this.attr('tag')}]`))         // or [tag*=${...}] ?
                .where(d => !withoutSiblings || !d.inside(this.siblings()))
                .except(this);
        } else if (dest.isString) {
            dest = this.$(dest);
        }
        // this.flyTo(dest, duration);
        (direct ? this : this.twin()).moveTo(dest, duration, done);
    },

    moveTo (destElement, duration, done, current = 0, end = duration, progress = 0) {       //Animation
        //TODO: Use Animation ~
        const frames = FrameRate * duration;
        const nextProgress = GradientRate(current / end);
        const surplusRatio = Math.max(0, nextProgress - progress) / (1 - progress);
        const styles = ['left', 'top', 'width', 'height', 'borderRadius'];
        destElement.style.opacity = '0';  // 0.0 normally
        // destElement.style.visibility = 'hidden';
        current = Math.min(current + FrameRate ** -1, end);
        
        styles.each(style => {
            const value = this[style].toString(),
                destValue = destElement[style].toString().floatValue,
                sourceUnit = value.unit(),
                destUnit = destElement[style].toString().unit();

            let currentValue = value.floatValue;

            if (sourceUnit !== destUnit) {
                if (sourceUnit === 'px' && destUnit === '%') {
                    currentValue = currentValue / this.width * 100;
                }
                else if (sourceUnit === '%' && destUnit === 'px') {
                    currentValue = currentValue / 100 * this.width;
                }
            }
            this.style[style] = (currentValue + (destValue - currentValue) * surplusRatio) + destUnit;
        });
        
        let rgba = [];
        this.backgroundColor.each((value, index) => rgba.push(value + (destElement.backgroundColor[index] - value) * surplusRatio));
        this.style.backgroundColor = `rgba(${rgba.join(', ')})`;
        
        if (current < end) {
            nextFrame(() => this.moveTo(destElement, (frames - 1) / FrameRate, done, current, end, nextProgress));
        } else {
            styles.each(p => this.style[p] = destElement[p] + destElement[p].toString().unit());
            // this.flyOut();
            // destElement.style.opacity = this.origin.style.opacity = '1';
            // or:
            destElement.style.visibility = this.origin.style.visibility = destElement.style.opacity = this.origin.style.opacity = '';
            this.remove();
            done();
        }
    },

    tryUpdate (key, value) {        //Try not update the text input cursor if value not changed
        (this[key] !== value) && (this[key] = value);
    },

    pick (attribute = 'selected', property = 'name') {
        // console.log({selector: `${this.tagName}[${property}="${this.attr(property)}"]`});
        this.doc.$$(`${this.tagName}[${property}="${this.attr(property)}"]`)
            .each(element => element.removeAttr(attribute));
        this.attr(attribute, '');
        // this.emit('pick');
    },

    $shadow (selector) {
        return this.shadowRoot.querySelector(selector);
    },
    $$shadow (selector) {
        return this.shadowRoot.querySelectorAll(selector).array();
    },
    onDragFiles (callback, dragClass = 'drag') {
        // console.log('Dragging');
        ['dragenter', 'dragover', 'dragleave', 'drop'].each(event => this.on(event, (e) => {
            if (event === 'dragenter') {
                this.addClass(dragClass);
            } else if (event.inside('dragleave', 'drop')) {
                this.removeClass(dragClass);
            }
            // e.dataTransfer.dropEffect = 'copy'; // default
            e.stopPropagation();
            e.preventDefault();
            if (event !== 'drop') { return; }
            
            const { items } = e.dataTransfer;
            const count = items.length, dataList = [];
            function maybeDone () {
                if (dataList.length === count) {
                    callback(dataList);
                }
            }
            
            Array.from(items).each((item, i) => {
                const file = item.getAsFile();
                const type = item.type,
                    isImage = type.includes('image'),
                    isText = type.includes('text');
                // console.log( item );
                if (isImage || isText) {
                    const reader = new FileReader();
                    reader.on('load', ({ target: { result } }) => {
                        if (isImage) {
                            const img = document.createElement('img');
                            img.src = result;
                            setTimeout(() => {
                                img.width = img.naturalWidth / devicePixelRatio;
                                img.height = img.naturalHeight / devicePixelRatio;
                                dataList.push([img, type, i, count]);
                                maybeDone();
                            });
                        } else {
                            dataList.push([result, type, i, count]);
                            maybeDone();
                        }
                    });
                    reader[isImage ? 'readAsDataURL' : 'readAsText'](file);
                } else {
                    dataList.push([file, type, i, count]);
                    maybeDone();
                }
            });
        
        }));
    },
    removeChildren (selector) {
        this.querySelectorAll(selector).each('remove'.toMethod());
    },
    binder (...args) {
        /*
            window.ht = h3.binder('content', 'textContent');
         */
        return {}.bindElement(this, ...args);
    },
    // isVisible () {
    //     let element = this
    //     while (element) {
    //         if (element.css('display') === 'none') {
    //             return false
    //         }
    //         element = element.parentElement || element.getRootNode().host

    //     }
    //     return true
    // },
    isHidden () {
        return this.offsetParent === null
    },
    // 2020-10-13
    
    fillBottom () {
        this.style.height = `calc(100vh - ${this.top}px)`
    },
    html (url) {
        return url.fetchText()
    },
    disableTemporary (duration = 2000) {
        this.attr('disabled', '')
        this.removeAttribute.bind(this).after(duration, 'disabled')
        return this
    }

});


window.$ = document.querySelector.bind(document);
HTMLElement.aliasMethods({
    enter: 'onReturn',
    matches: 'is',       // CSS3 use :is(...)
    // setStyle: 'css'      // css(key, value)
});
HTMLElement.gets({

    left () {   //screenX
        return this.screenRect.left + window.scrollX;
    },
    // right () {  // To Parent
    //     return this.parentElement.screenRect.right - this.screenRect.right;
    // },
    right () {  // To Window
        return window.innerWidth - this.screenRect.right
    },
    top () {    //screenY
        return this.screenRect.top + window.scrollY;
    },
    bottom () {    //screenY
        return this.screenRect.bottom + window.scrollY;
    },
    relativeLeft () {
        return this.left - this.parentElement.left;
    },
    relativeTop () {
        return this.top - this.parentElement.top;
    },
    width () {
        return this.screenRect.width;
    },
    domWidth () {       // for element which has own width property already, like canvas
        return this.screenRect.width;
    },
    height () {
        return this.screenRect.height;
    },
    domHeight () {
        return this.screenRect.height;
    },

    borderRadius () {
        return this.computedStyles.borderRadius;
    },

    coordinate () {       //On Screen, not including the scrolled XY
        return this.screenRect.toJSON().keyMap(v => v + 'px');
    },

    floatValue () {
        return Number.parseFloat(this.value);
    },

    computedStyles () {
        return window.getComputedStyle(this);
    },

    screenRect () {
        return this.getBoundingClientRect();
    },
    screenLeft () {
        return this.screenRect.left
    },
    screenRight () {
        return this.screenLeft + this.screenRect.width
    },
    backgroundColor () {
        return this.color('backgroundColor');
    },

    offsetRight () {
        return this.offsetLeft + this.offsetWidth;
    },

    offsetBottom () {
        return this.offsetTop + this.offsetHeight;
    },

    domIndex () {
        return [...this.parentElement.children].indexOf(this);
    },

    doc () {
        return this.ownerDocument;
    },

    window () {
        return this.doc.defaultView;
    },

    tag () {   // HomeHeader => home-header
        return this.constructor.name.replace(/[A-Z]/g, (char, index) => (index ? '-' : '') + char.toLowerCase())
    },

});

Object.prototype.assign({
    bindElement (element, key = 'value', property) {
        /*
         window.test = {};
         test.bindElement(input);
         */
        property = property || element.findProperty('value', 'innerHTML', 'textContent'); // textContent will make it display HTML tags
        Object.defineProperty(this, key, {
            get () { return element[property]; },
            set (value) { element[property] = value }
        });
        return this;
    },
    findProperty (...properties) {
        for (const p of properties) {
            if (p in this) {
                return p;
            }
        }
    }
});

Array.extendMethods({
    inputValues() {       //For HTMLInputElement list
        return this.select('value').pluck('floatValue');
    },
    on (...args) {  // Items event
        this.each(item => (item instanceof EventTarget) && item.on(...args));
    },
    off (...args) {
        this.each(item => (item instanceof EventTarget) && item.off(...args));
    },
    findElement (selector) {
        return this.find(element => element.is(selector));
    },
    choose (element, attribute = 'selected', property = 'name') {

    }
});


// const Config = {
//     get animationDuration () {
//         return document.documentElement.cssVar('duration').toFloat();
//     },
//     set animationDuration (value) {
//         document.documentElement.cssVar('duration', value);
//     }
// };
// function CallAfterDone (callback, element = document.documentElement) {
//     setTimeout(callback, element.cssVar('duration').toFloat() * 1000);
// }
// Config.animationDuration = '0.4s';
