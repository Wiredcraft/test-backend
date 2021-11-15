window.html = (literals, ...params) => {    // For the syntax highlight in VSCode
    let result = ''
    for (let i = 0; i < literals.length; i++) {
        result += literals[i] + (i < params.length ? params[i] : '')
    }
    return result
}

String.gets({       //Should be removed...
    // value () {      //For inputs value~~~, should be removed
    //     return Number.parseFloat(this);
    // },
    floatValue () {
        return Number.parseFloat(this);
    },
    isInt () {
        return !!this.match(/^\d+$/);
    },
    isFloat () {
        return this.toFloat().toString() === this;
    },
    list () {
        return this.split(/\t|\n/).values;
    },
    pretty () {
        return this.replace(/\n|\t| /g, '').replace(/,/g, ', ');
    },
    fn () {
        return x => x[this]();
    },
    reversed () {
        //  ['123', '567'].map('reversed'.prop);
        //  ['321', '765']
        return [...this].reverse().join('');        // Work for emojis!!
        // return Array.from(this).reverse().join('');
        // let reversed = '';
        // for (const char of this) {
        //     reversed = char + reversed;
        // }
        // return reversed;
        // [...'He🤗llo'].length => 6, 'He🤗llo'.split('').length => 7
        // return this.split('').reverse().join('');    // Not work for emojis:  🥵
    },
    prop () {
        // ['Hello', 'World'].prop('length') =>
        // ['Hello', 'World'].map('length'.prop) =>
        return item => item[this];
    },
    method () {     //...args
        //['Hello', 'World'].map('toLowerCase'.method) =>
        //['Hello', 'World'].map(i => i.toLowerCase())
        return (item, ...args) => item[this](...args);
    },
    charList () {
        return [...this];//.split('')  Working for Emojis;
    },
    html () { //Wrap every line with DIV
        const legal = this.replace(/&/g,  '&amp;')
                          .replace(/  /g, '&nbsp; ')
                          .replace(/</g,  '&lt;')
                          .replace(/>/g,  '&gt;');
        return `<div>${legal.replace(/\n/g, '</div><div>')}</div>`.replace(/<div><\/div>/g, '<div>&nbsp;</div>');// '<br/>');
    },
    simpleHTML () { 
        return this.replace(/&/g, "&amp;")
                   .replace(/  /g, '&nbsp; ')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/\n/g, '<br/ >')
    },
    date () {
        return new Date(this).chinesePrettyPrint()
    }
});

let startWidth = 10;
String.titleWidth = 15;

String.extendMethods({
    jsonObject () {
        return JSON.parse(this);
    },
    parseEncodedURL () {
        /*
        'http:\\u002F\\u002Fbdmov.a.yximgs.com\\u002Fbs2\\u002FnewWatermark\\u002FMjA1NzI1NzQzMTU_zh_4.mp4'
        =>
        'http://bdmov.a.yximgs.com/bs2/newWatermark/MjA1NzI1NzQzMTU_zh_4.mp4'
         */
        return JSON.parse(`"${this}"`);
    },
    assignLeft (...objs) {
        for (let i = 0; i < objs.length - 1; i++) {
            // if (objs[i + 1][this] !== undefined) {
            objs[i][this] = objs[i + 1][this]
            // }
        }
    },
    eachReplaced (from = '（）。', to = '().') {
        let text = this;
        for (let i = 0; i < from.length; i++) {
            text = text.replace(new RegExp(from[i], 'g'), to[i]);
        }
        return text;
    },
    round (count) {
        return Number.parseFloat(this).round(count);
    },
    capitalized () {        // i LOVE you 3d-images => I Love You 3D Images
        return this.toLowerCase().replace(/(^|[^a-z])[a-z]/g, v => v.toUpperCase()).replace(/-/g, ' ');
    },
    toFloat () {
        return Number.parseFloat(this);
    },
    time (ws) {
        return (new Date(this)).time(ws)
    },
    toPrice (...sth) {
        return Number.parseFloat(this).toPrice(...sth)
    },
    day () {
        return (new Date(this)).day('-')
    },
    daytime (withSecond = false) {
        return `${this.day()} ${this.time(withSecond)}`
    },
    weekday () {
        const date = new Date(this)
        const now = new Date()
        const passed = now - date
        const today = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
        const yesterday = passed > 0 && (now - date) < (48 * 3600000) && (now.getDay() - date.getDay()).inside(1, -6) 
        if (today) {
            return '今天'
        } else if (yesterday) {
            return '昨天'
        } else {
            return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
        }
    },
    age() {
        return Math.floor((new Date() - new Date(this)) / (365.25 * 24 * 3600000))
    },
    int () {
        return this.round(0);
    },
    allReplace (substr, newStr) {
        return this.replace(new RegExp(substr, 'g'), newStr);
    },
    firstChar () {
        return this[0] && String.fromCodePoint(this.codePointAt(0));
    },
    contains (subs) {
        return this.toLowerCase().search(subs.toLowerCase().trim()) >= 0
    },
    randomChar () {
        return this[this.length.random()];
    },
    bind (obj, ...args) {
        //let push = (array, ...items) => items.each('push'.bind(array).only(1)), a = [0, 0];  only(1) for each(value, `index, items`)
        //push(a, 1, 2, 3);     // a => [0, 0, 1, 2, 3]
        // return obj[this].bind(obj, ...args);     // obj::obj[this]  obj::this    ::obj[this]
        return obj.boundMethod(this, ...args);
    },
    func () {
        return x => x[this]();
    },
    toMethod (...init) {    // doc.querySelectorAll(selector).each('remove'.toMethod())
        return (elt, ...args) => elt[this](...init, ...args);
    },
    sort (asc = true) {
        return (a, b) => (a[this] - b[this]) * (asc ? 1 : -1);
    },
    fill (dataObj, defaultValue = '') {         // {{ ... }}
        return this.replace(/{{\s*((\w|-)+)\s*}}/g, (match, name) => {
            return dataObj[name] || defaultValue;
        });
    },
    sharpen (dataObj, defaultValue = '') {     // #[ ... ]#
        return this.replace(/#\[\s*((\w|-)+)\s*\]#/g, (match, name) => {
            return dataObj[name] || defaultValue;
        });
    },
    sharpenParenthesis (dataObj, defaultValue = '') {    // #(..)#
        return this.replace(/#\(\s*((\w|-)+)\s*\)#/g, (match, name) => {
            return dataObj[name] || defaultValue;
        });
    },
    singleLine () {
        return this.replace(/\r|\n/g, '');
    },
    withoutSpace () {
        return this.replace(/ |\t/g, '');
    },
    rgb () {
        const color = this.withoutSpace().toLowerCase();
        let rgb = [];
        if (color.startsWith('#')) {
            const length = color.length === 4 ? 1 : 2;
            for (let i = 0; i < 3; i++) {
                rgb.push(Number.parseInt('0x' + color.substr(1 + length * i, length).repeat(2 / length)));
            }
        } else if (color.startsWith('rgb')) {
            rgb = color.match(/\d+/g).left(3).map(Number.parseInt.unary);
        } else {
            rgb = this.rgba().left(3);
        }
        return rgb;
    },
    colorWithOpacity (opacity) {
        return `rgba(${this.rgb().join()}, ${opacity})`;
    },
    rgba() {
        // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
        // color must be a valid canvas fillStyle. This will cover most anything
        // you'd want to use.
        // Examples:
        // colorToRGBA('red')  # [255, 0, 0, 255]
        // colorToRGBA('#f00') # [255, 0, 0, 255]
        let cvs, ctx;
        cvs = document.createElement('canvas');
        cvs.height = 1;
        cvs.width = 1;
        ctx = cvs.getContext('2d');
        ctx.fillStyle = this;
        ctx.fillRect(0, 0, 1, 1);
        return ctx.getImageData(0, 0, 1, 1).data.array();
    },
    averageColor (callback) {
        const image = new Image();
        image.src = this;
        image.onload = ({ target: img }) => {
            const width = img.naturalWidth, height = img.naturalHeight;
            const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
            canvas.assign({ width, height });
            ctx.drawImage(image, 0, 0);
            const { data } = ctx.getImageData(0, 0, width, height);
            let r = 0, g = 0, b = 0, count = data.length / 4;

            console.time('calc');
            for (let i = 0; i < count; i++) {
                r += data[i * 4];
                g += data[i * 4 + 1];
                b += data[i * 4 + 2];
            }
            r /= count;
            g /= count;
            b /= count;
            callback({ r, g, b }.valueMap(Number.parseInt));
            console.timeEnd('calc');
        };
    },
    properFrontColor () {
        const [r, g, b] = this.rgb();
        const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b).round(0);
        return (luma > 100) ? 'var(--dark, #333)' : 'var(--light, #ddd)';
        // const res = calc + 128 * (luma > 128 ? -1 : 1);
        // return '#' + res.toString(16).repeat(3);
        // return '#' + (255 - luma).toString(16).repeat(3);
    },
    unit (defaultValue = 'px') {
        return this.replace(/^(\d|\.)*/, '') || defaultValue;
    },
    padCenter (minLength, char) {
        let countPad = (minLength - this.length) / 2;
        if (countPad > 0) {
            return this.padStart(Math.ceil(countPad) + this.length, char)
                       .padEnd(minLength, char);
        } else {
            return this;
        }
    },
    start (width = this.length) {// (String.titleWidth) {
        startWidth = width;
        console.time(this.padEnd(width));
    },
    done (width = startWidth) {
        console.timeEnd(this.padEnd(width));
    },
    fnTime (fn) {
        console.time(this);
        const result = fn();
        console.timeEnd(this);
        return result;
    },
    fnLog () {
        return () => console.log(this);
    },
    trimLines () {
        return this.trim().split('\n').map('trim'.fn).join('\n');
    },
    async fetchJSON (config = {}) {
        return await (await fetch(this, config)).json();
    },
    async fetchText (config = {}) {
        return await (await fetch(this, config)).text();
    },
    unparseHTML () {
        let code = {
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&amp;': '&',                
        }
        let output = this
        code.loop((k, v) => {
            output = output.replace(new RegExp(k, 'g'), v) 
        })
        return output
    },
    urlBgColor (defaultColor = '#eee') {
        const color = this.match(/-(\w{6}|\w{8})\./)    //rgb or rgba 
        return color ? `#${color[1]}` : defaultColor;
    },
    srcInfo ({ screenWidth = 414, maxRatio = 1.0 } = {}) { //default
        const size = this.match(/-(\d+)x(\d+)(\.|-)/), textDuration = this.match(/-d-(\d+)\./)
        // const screenWidth = 414
        if (size) { //image
            const maxWidth = screenWidth * maxRatio
            let width = maxWidth, height = maxWidth
            if (size) {
                width = Number.parseInt(size[1]) 
                height = Number.parseInt(size[2])
                if (width > maxWidth) {
                    height = height / width * maxWidth
                    width = maxWidth
                }
            }
            return { width, height, bgColor: this.urlBgColor() }
        } else if (textDuration) {    //video
            let duration = (Number.parseInt(textDuration[1]) || 2000)/ 1000,
                durationTitle = `${Math.round(duration)}''`
            return { duration, durationTitle }   //to seconds
        } else {
            console.log('Nothing')
            return { width: screenWidth, height: screenWidth, bgColor: '#abc'}
        }
    },
    dataURLtoFile (filename) { // https://uploadcare.com/community/t/how-to-upload-base64-encoded-image-from-javascript/53
        if (!this.startsWith('data')) {
            console.log('Not dataURL', this)
            return this;
        }

        if (!filename) {
            window.fileCount = window.fileCount || 1;
            filename = `file-${fileCount}`
            fileCount++
        }
        let arr = this.split(','),   // this = dataURL ="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy....
            type = arr[0].match(/:(.*?);/)[1],  //image/svg+xml   MIME
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type });
    },
    transferCamel () {
        return this.replace(/[A-Z]/g, (sth) => '-' + sth.toLowerCase())
    }
});

//ES2017: String.padStart  String.padEnd

// setTimeout(() => {
//     console.log('#ff53b2d9'.properFrontColor());
//     console.log('rgb(220, 20, 22, 100)'.properFrontColor());
// }, 100);

















