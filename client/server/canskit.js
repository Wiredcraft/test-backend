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

const $memo = $once //.memorized()
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
    $buildTabRemember
})


async function $login () {

    const data = await $memo(':login', { phone: '15089323844', password: 'test' })
    console.log(data)
    if (data.state === ':ok') {
        const { passport } = data
        headers = new Headers({ 
            passport,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         }) // For following http request verification
        $sure('@login', data)
    }
}
$login()