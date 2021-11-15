

window._ = (...args) => {
    console.log('Do nothing');
    console.log(args);
};
const DPR = window.devicePixelRatio,
      vw = document.body.width / 100


function Until (fn, callback, interval = 100) {
    const res = fn()
    if (!res) {
        setTimeout(Until, interval, ...arguments)
    } else {
        callback(res)
    }
}
async function UntilPromise (fn, interval) {
    return new Promise(resolve => Until(fn, resolve, interval))
}

window.Sustain = function (func, interval, ...args) {
    func(...args);
    return setInterval(...arguments);
}
window.someFrames = (n, fn, ...args) => {       // n requestAnimationFrame every frame
    if (n === 0) {
        fn(...args, n);
    } else {
        nextFrame(() => someFrames(n - 1, fn, ...args));
    }
};
console.green = (content, ...args) => {
    console.log(`%c${content}`, 'color: #5f5;', ...args)
}
console.red = (content, ...args) => {
    console.log(`%c${content}`, 'color: #f55;', ...args)
}
console.blue = (content, ...args) => {
    console.log(`%c${content}`, 'color: #3af;', ...args)
}

function JSONStorage (key, def = []) {
    return JSON.parse(localStorage[key] || 'null') || def
}

window.COLORS = [
    '#82b440',
    '#17a2b8',
    '#ff9f43',
    '#3C89DA',
    '#E15858',
    '#f66d9b',
    '#007FFF',
    '#ff7321',
    '#9367B4',
]
Object.assign(window, {
    Colors: {
        canvasLine: '#0A7AFF',
        canvasShadllow: '#5AC8FA',
        canvasShadow: 'rgba(0, 0, 0, 0.10)'
    },
    XFields: {},
    vw, 
    DPR,
    vr: vw * DPR,
    nextFrame: window.requestAnimationFrame,
    sleep: ms => new Promise(res => setTimeout(res, ms)),
    waitFrame: (count = 1) => {
        return new Promise(resolve => {
            const next = () => {
                if (count === 0) {
                    resolve()
                } else {
                    count -= 1
                    nextFrame(next)
                }
            }
            next()
        })
    },
    pi: Math.PI,
    $online: !(/wcraft\.com/i.test(location.host)),             // For Debuging
    JsonLog: sth => console.log(JSON.stringify(sth, '', 2)),
    isDark: window.document.documentElement.matches('.dark-mode'),
    ConnectionType: {
        connect: '正常',
        reconnect: '重新连接'
    },
    Constant: {
        durationShort: 300,
        duration: 800,
        durationLong: 1000,
        None: '~'
    },
    async $fetchJSON (url, config = { }) {
        return await $fetch(url, { type: 'json', ...config })
        // return await (await fetch(url, config)).json();
    },
    async $fetchText (url, config = { }) {
        return await $fetch(url, { type: 'text', ...config })
    },
    async $fetch (url, { type, cache = true, ...others } = {}) {
        const key = `${type}=>${url}`
        const loading = `${key}-loading`
        if (!(cache && $fetch[key])) {
            if (cache && $fetch[loading]) {
                while (!$fetch[key]) {
                    // console.log('Loading....', key)
                    await sleep(10)
                }
            } else {
                $fetch[loading] = true
                $fetch[key] = await ((await fetch(url, others))[type]())
                $fetch[loading] = false
            }
        }
        return $fetch[key]
    },
    async $fetchNice (url) { // api/campus/list
        return (await $fetchJSON(`https://nice.cn/${url}`)).data
    },
    UntilPromise, Until, JSONStorage
})


if (!$online) {
    document.title = 'WiredCraft'
} else {
    document.title = `WiredCraft-[${location.host}]`
}
window.$test = {
    randomPhone () {
        return Math.random().toString().replace('0.', '1').slice(0, 11)
    }
}