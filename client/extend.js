

HTMLElement.extendMethods({
    $fly (callback) {
        this.addClass('fly-away')
        this.animated(() => {
            this.remove()
            callback?.()
        })
    },
    $leave (callback) {
        this.addClass('fade-away')
        this.animated(() => {
            this.remove()
            callback?.()
        })
    },
    $on (evtName, callback) {
        return this.on(evtName, e => {
            callback(e.detail, e)
        })
    },
    pluck (name) {
        return Array.from(this.children).map(item => item.attr(name))
    },
    $fadeDestroy () {
        this.fadeOut()
        this.onDestroy()
    },
    fadeAMoment () {
        this.addClass('fade-in')
        setTimeout(() => this.removeClass('fade-in'), 2000)
    }
})
String.extendMethods({
    when (cond) {
        return cond ? this : ''
    },
    clock () {
        const [ hour, minute ] = this.split(':').map(Number.parseInt.unary)
        return { hour, minute }
    }
})

String.gets({
    $sex () {
        return (this === ':female' ? '女' : '男')
    },
    isUploaded () {
        return this.length > 1000
    }
})
Array.extendMethods({
    onEach(...args) {
        return this.each(dom => dom.on(...args))
    }
})

HTMLInputElement.extendMethods({
    detect (fn) {
        let composing = false 
        this.on('input', () => {        
            if (!composing) {
                fn(this.value.trim())
            }
       }).on('compositionstart', () => {
           composing = true
       }).on('compositionend', () => {
           composing = false
           fn(this.value.trim())
       }).on('esc', () => {
            this.value = ''
            fn(this.value.trim())
       })
       return this
    }
})