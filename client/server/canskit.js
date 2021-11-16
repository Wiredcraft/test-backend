let headers

const $send = (action) => console.log('Do nothing', action)
const $once = async (action, data, method = 'GET') => {
    let url = `/api/${action.replace(':', '')}`
    if (method === 'GET') {
        data?.loop((key, value) => {
            if (value) {
                url += `/${key.transferCamel()}/${encodeURIComponent(value)}`
            }
        })
    }
    console.log({ url })
    return (await fetch(url,  { 
        method,
        headers,
        body: method === 'POST' ? JSON.stringify(data) : undefined
    })).json()
}
const $broadcast = async (broadcast, data) => {
    const values = await $once(broadcast, data, 'POST')
    window.nextFrame(() => $emit(broadcast, { ...values, $self: true, broadcast: true }))
}

const $$ = $once.memorized()
const $clear = (...args) => $$.unmemorize(...args)
const $cleanUp = (sth) => {
    $$.clearAllCache()
    console.log(`%c[[ CLEAN UP ]] `, 'color: #ED4C67', sth)
}
const $memo = async (...args) => {
    const data = await $$(...args)
    if (data?.severity === 'ERROR') {
        Prompt.alert(data.hint)
        return new Promise(() => console.log('Wait forever..., ignore it'))
    } else {
        return data
    }
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
    $cleanUp,
    $buildTabRemember
})


async function $login () {

    const data = await $memo(':login', { phone: '15089323844', password: 'test' })
    console.log(data)
    if (data.state === ':ok') {
        const { passport, mmid, ssid } = data
        headers = new Headers({ 
            passport,
            ssid,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         })
         console.log({ headers })
        $sure('@login', data)
        window.$mmid = mmid
    }
}
$login()