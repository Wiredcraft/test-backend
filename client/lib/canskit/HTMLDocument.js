window.isChrome = navigator.vendor.includes('Google') // Inc.' // userAgent.includes('Chrome');
// document.constructor.name
// this.ownerDocument === document
// <html> === document.documentElement
const Prefix = 'manual';
function ComatiableEvent (e) {
    if (e.constructor.name === 'TouchEvent') {
        const touch = e.changedTouches.last();
        e.assign({clientX: touch.siteX, clientY: touch.siteY});
    }
    return e;
}

HTMLDocument.extendMethods({
    // init () {
    //     this.appendCSSs = Code.everyArgOnce('appendCSS'.bind(this));
    // },
    appendCSS (href) {
        // this.defaultValue('CSSs', []);      // Or: this.CSSs = this.CSSs || [];
        this.CSSs = this.CSSs || []
        if (!this.CSSs.includes(href)) {
            this.createElement('link')
                .assign({rel: 'stylesheet', href})
                .appendTo(this.head);
            this.CSSs.push(href);
        }
    },
    appendCSSs (...hrefs) {
        // hrefs.each('appendCSS'.bind(this));
        hrefs.each(this.boundMethod('appendCSS'));
    },
    appendElement (tag) {
        const newElement = this.createElement(tag);
        this.body.append(newElement);
        return newElement;
    },
    insertHTMLAfter (html, after) {
        const element = html instanceof HTMLElement ? html : this.createHTMLElement(html);
        if (after.isString) {
            after = this.querySelector(after);
        }
        after.parentNode.insertBefore(element, after.nextElementSibling);
    },
    prependElement (tag) {
        const newElement = this.createElement(tag);
        this.body.insertBefore(newElement, this.body.firstElementChild);
        return newElement;
    },
    createHTMLElement (html, id) {
        const template = this.createElement('template');
        template.innerHTML = html.trim();
        const element = template.content.firstChild;
        id && element.assign({id});
        return element;
    },
    fetchElement (html, id, parent = this.body) {       //Get it if existed, or created it
        const existed = this.getElementById(id);
        if (existed) {
            existed.existed = true;
            return existed;
        } else {
            html = html.trim();
            const tagClass = html.match(/^(\w+)(?:\.(\w+))?/);
            if (tagClass) {
                const [, tag, className] = tagClass;
                html = `<${tag}${className ? ` class="${className}"` : ''}></${tag}>`;
            }
            const created = this.createHTMLElement(html, id);
            parent.append(created);
            created.existed = false;
            return created;
        }
    },
    createElements (count, tag) {
        return this.createElement.thisRepeat(this, count, tag);
    },
    // maskIn () {
    //     return this.fetchElement('div.mask').callSoon('fadeIn');//.bind(mask).next();
    // },
    // maskOut () {
    //     return this.querySelector('.mask').fadeOut();
    // },
    addKeyframes (cssText, name = `${Prefix}-animation-${this.countAnimation || 1}`) {
        const css = this.styleSheets[0];
        this.countAnimation = (this.countAnimation || 1) + 1;
        css.insertRule(`@keyframes ${name} { ${cssText} }`, css.cssRules.length);
        // this.keyframes.appendChild(this.createTextNode(`
        // @keyframes ${name} {
        //     ${cssText}
        // }`));
        // console.log(name);
        return name;
    },
    dragRegion (callback = _, { color, action = 'on' /* or 'once' */} = {}) {
        let box, down, moved;
        const event = action.bind(this);
        function drag (move) {
            moved = true;
            move = ComatiableEvent(move);
            box.setStyle({
                left: Math.min(down.clientX, move.clientX) + 'px',
                top: Math.min(down.clientY, move.clientY) + 'px',
                width: Math.abs(down.clientX - move.clientX) + 'px',
                height: Math.abs(down.clientY - move.clientY) + 'px'
            });
        };
        const stop = () => {
            this.off('mousemove touchmove', drag);        // maybe alose remove
            this.body.setStyle({cursor: 'default'});
            box && this.body.removeChild(box);
            box = null;
        }
        
        event('mousedown touchstart', e => {
            down = ComatiableEvent(e);
            moved = false;
            box = document.appendElement('div');
            box.setStyle({ position: 'fixed', 'background-color': color || Math.randomColor({ minAlpha: 0.2, maxAlpha: 0.5, b: 100})});
            this.on('mousemove touchmove', drag);
            this.body.setStyle({cursor: 'cell'});
            this.esc(stop);
            this.dragging = true;
            // console.log(drag);
        });
        event('mouseup touchend', up => {
            this.dragging = false;
            this.off('esc touchend', stop);
            this.off('mousemove touchemove', drag);
            if (!box) {
                return;
            }
            stop();
            up = ComatiableEvent(up);
            const data = {
                left: Math.min(down.clientX, up.clientX),
                top: Math.min(down.clientY, up.clientY),
                width: Math.abs(down.clientX - up.clientX),
                height: Math.abs(down.clientY - up.clientY),
            };
            data.right = data.left + data.width;
            data.bottom = data.top + data.height;
            moved && callback(data);
        });
    },
    uploadImage ({ multiple = false, accept = 'image/*', type = 'file' } = {}) {
        return new Promise(resolve => {
            const upload = document.createElement('INPUT')
            upload.assign({ multiple, accept, type })
            
            upload.on('change', async () => {
                const { files } = upload
                if (multiple) {
                    const info = []

                    for (const file of files) {
                        info.push(await imageFileInfo(file))
                    }
                    resolve({ info, files })
                } else {
                    resolve(await imageFileInfo(files[0]))
                }
            })
            upload.click();
        })
    },
    uploadFile ({ accept = '.xlsx, .xls, .csv, .numbers' } = {}) {
        return new Promise(resolve => {
            const upload = document.createElement('INPUT')
            upload.assign({ accept, type: 'file' })
            
            upload.on('change', () => resolve(upload.files))
            upload.click();
        })
    }
});
async function imageFileInfo (file) {
    console.log('imageFileInfo', file)
    return new Promise(resolve => {
        const reader = new FileReader();                    
        reader.readAsDataURL(file);
        reader.on('load', e => {
            const image = new Image()
            image.src = e.target.result
            image.on('load', () => {
                const { width, height, src } = image
                // console.log({ height, width, src }) 
                resolve({ width, height, image, src, file })
            })
        })
    })
}

// setTimeout(() => {
//     document.addKeyframes(`from {
//             transform: scale(1);
//         }
//         50% {
//             transform: scale(var(--scale, 1.4));
//         }
//         to {
//             transform: scale(1);
//         }`, 'scale')
// }, 1000);

HTMLDocument.aliasMethods({
    // querySelector: '$',
    // querySelectorAll: '$$',
});

Window.gets({       // Window, not window
    ratio () {
        return this.innerWidth / this.innerHeight;
    }
});
