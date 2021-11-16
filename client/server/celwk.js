const Subscriptions = {}
const { host, protocol } = window.location
const websocketProtocal = protocol.replace('http', 'ws')// === 'https:' ? 'wss:' : 'ws:'
const url = `${websocketProtocal}//${host}/:member/`   // Not wss 

let ws   // ws.binaryType = 'arraybuffer';  For Binary data => Audio/Video Use fetch
let passport, headers, restarted = 0, mmid
let $show = false
window.KEY = Math.floor(Math.random() * 1000000) + '-' + new Date().getTime() // new Date().getTime()

let loggedIn = true;

window.$logging = [':the-salesman']

function $startSocket () {
    ws = new WebSocket(url)
    ws.onopen = evt => {
        console.log('%cOpened', `color: #3f3; font-size: 0.8rem`, (new Date()).time())
        
        $emit('#refresh', 'Connect Socket')
        $login()    // Do it everytime disconnect
    }
    ws.onclose = evt => {
        console.log('%cClosed', `color: #c55; font-size: 0.8rem`, evt)
        loggedIn = false 
        $emit('@close-other-screens')
        setTimeout(() => nextFrame($startSocket), 2000)
    }
    ws.onerror = evt => console.log('%cError', `color: #f33; font-size: 0.9rem`, evt)
    ws.onmessage = ({ data }) => {
        const info = JSON.parse(data)
        const { action, content, key, broadcast, error } = info

        if ($logging.includes(action)) {
            console.log(content)
        }        
        if ($show) {
            console.log(`%c [${action.substring(1)}]`, 'color: #77ffff; font-size: 0.8rem')
            console.log(content)
        }
        if (content && content.status === -1 && action === ':login') {
            Prompt.tip('Login, please.')
            return
        }
        
        const handlers = Subscriptions[$actionKey(action, key)] // $once Mostly
        if (action) {
            if (handlers) {
                handlers.forEach(callback => {
                    window.nextFrame(() => callback(content, info))
                })
            }
            else {
                // No $once $memo fn
                console.warn({ 'No Reaction': action, broadcast })
            }
        } else if (broadcast) {
            window.nextFrame(() => $emit(broadcast, { ...content, $self: key === window.KEY, broadcast: true }))
        } else if (error) {
            window.nextFrame(() => {
                Prompt.tip(content['@error'], 3)
            })
        } 
     
        if (action === ':error') {
            console.error(content)
        }
    }
}
$startSocket()
const $actionKey = (action, key) => `${action}${key ? `-${key}` : '' }`

function $send (action, value, key) {
    if (ws.readyState === 1 && (loggedIn || action === ':login')) {
        ws.send(JSON.stringify({ action, value, key}))
    } else {    // console.log('Next')
        setTimeout($send, 200, action, value, key)
    }
}
function $once (action, value, key) {
    const ak = $actionKey(action, key)
    return new Promise(resolve => {
        const callback = data => {
            resolve(data)
            delete Subscriptions[ak]
        }
        callback.assign({ key })
        Subscriptions[ak] = [callback]
        $send(action, value, key)
    })
}
const $broadcast = (broadcast, value) => ws.send(JSON.stringify({ broadcast, value, key: KEY })) // $send
const $memo = $once.memorized()
const $clear = (...args) => $memo.unmemorize(...args)
const $cleanUp = (sth) => {
    $memo.clearAllCache()
    console.log(`%c[[ CLEAN UP ]] `, 'color: #ED4C67', sth)
}
const $renew = (...args) => {
    console.log(`%c|| CLEAR => ${args.jsonString()}`, 'color: #e5503966')
    $clear(...args)
    return $$(...args)
}


window.Global = window

function $buildTabRemember (name) {
    const key = id => `${name}##${id}`
    const current = (id, def = '0') => localStorage[key(id)] || def
    const store = (id, n) => localStorage[key(id)] = n
    return [current, store]
}

Object.assign(window, {
    $send, 
    $broadcast,
    $once,
    $memo, 
    $clear, 
    $renew, 
    $cleanUp,
    Subscriptions,
    ws,
    $buildTabRemember
})


async function $login () {
    const data = await $memo(':login', { phone: '15089323844', password: 'test' })
    console.log(data)
    if (data.state === ':ok') {
        ;({ passport, mmid } = data)
        headers = new Headers({ passport }) // For following http request verification
        loggedIn = true 
        window.$mmid = mmid
        $sure('@login', data)
    }
}
