$on('*', (data, action) => {
    const broadcasting = data?.broadcast // /^:broadcast\./.test(action)
    if (broadcasting) {
        // $emit('#refresh', action)
        $emit('broadcast', { data, action })
    }
})('#refresh', (why) => {
//     console.log('Refresh...', why)
    $emit('@close-other-screens')
    $cleanUp(why || 'Refresh =>')
})('@quick-search', () => {
    const current = document.querySelector('quick-search')
    if (current) {
        current.$leave()
        return
    } else {
        document.body.appendChild(new QuickSearch())
    }
})('broadcast', ({ data, action }) => {
    console.log('broadcast...', data, action)
    $emit('#refresh', action)
})

document.on('keydown', e => {
    if (e.code === 'KeyP' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        $emit('@quick-search')
        return false
    }
})