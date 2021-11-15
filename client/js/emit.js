const Subscriptions = {}

function $emit (action, data) {  
//     console.log('Emit =>', action, data)
    // "action" maybe "broadcast"
    const handlers = Subscriptions[action]
    // Global first
    Subscriptions['*']?.each(callback => callback(data, action))

    if (handlers) {
        handlers.forEach(callback => callback(data))
    } else {
        console.warn('No handelr:', { action, data })
    }
}
function $sure (action, ...data) {      // Maybe emit before monitored
    const handlers = Subscriptions[action]
    if (handlers) {
        handlers.forEach(callback => callback(...data))
    } else {
        console.log('Wait...', action)
        setTimeout($sure.with(action, ...data), 100)
    }
}

function $catch (action, callback) {   // Can inside if (sthDynamically) { $mono ... } monopolize
    Subscriptions[action] = [callback]
    return $catch
}


function $on (action, callback) {
    const current = Subscriptions[action]
    if (current) {  // x-box
        current.push(callback)
    } else {
        Subscriptions[action] = [callback]
    }
    return $on
}
function $off (action, callback) {
    if (callback) {
        Subscriptions[action].remove(callback)
    } else {
        delete Subscriptions[action]
    }
}

const $when = (field, callback) => data => {
    if (data?.[field]) {
        callback(data)
    }
}

async function $GET (url, { type = 'json', config = {}, cache = true } = {}) {

    const saved = $GET.store[url]
    if (cache && saved) {
        console.log('Cached', url)
        return saved
    } else {
        const data = (await (await fetch(url, config))[type]())
        $GET.store[url] = data
        return data
    }
}
$GET.store = {}
const $open = $emit.with('@open')
Object.assign(window, {    
    $on,
    $off,
    $catch, 
    $emit,
    $sure,
    $GET,
    $when, 
    emit: $emit,
    $open,
    $subcribe: Subscriptions
})
