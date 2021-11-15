let $sharedCSS, loading = false
const $processor = []

window.$initScreen = location.pathname.slice(1) || 'home-overview'
window.$cssList = []
class Component extends HTMLElement {
    static get tag () {
        return this.name.replace(/[A-Z]/g, (char, index) => (index ? '-' : '') + char.toLowerCase())
    }
    static $publish () {
        window.customElements.define(this.tag, this)
        window.assign({ 
            [this.name]: this 
        })
    }

    $bind (method) {
        return this[method].bind(this).throttle()
    }
    loadSharedCSS () {
        if ($sharedCSS !== undefined) {
            return $sharedCSS
        }
        return new Promise(resolve => {
            $processor.push(resolve)
            if (!loading) {
                loading = true 
                Promise.all($cssList.map($fetchText.unary)).then((cssList) => {
                    $sharedCSS = cssList.join('\n')
                    while ($processor.length) {
                        $processor.shift()($sharedCSS)
                    }
                })
            }
        })
    }
    get staticsFile () {
        return this.tag
    }
    html () {
        return $fetchText(`/${this.dir}/${this.staticsFile}/${this.staticsFile}.htm`)
    }
    get cssURL () {
        return `/${this.dir}/${this.staticsFile}/${this.staticsFile}.css`
    }
    async styleLinks () {
        let cssLinks = this.moreCSS ?? [], 
            css = ''
        if (cssLinks && !Array.isArray(cssLinks)) {
            cssLinks = [cssLinks]
        }
        if ($online) {
            for (const link of cssLinks) {
                css += await $fetchText(link) + '\n'
            }
        } else {
            css = cssLinks.map(link => html`<link rel="stylesheet" href="${link}" />` ).join('\n')
        }
        // console.log({ css })
        return $online
            ? `<style>${ await this.loadSharedCSS() }
                      ${ css } 
                      ${ await $fetchText(this.cssURL) }
               </style>`    // Load CSS before compile
            : html`${$cssList.map(src => html`<link rel="stylesheet" href="${src}" />`).join('\n')}
               ${ css }
               <link rel="stylesheet" href="${this.cssURL}" />`
    }
    async fetchCode (callback) { // HTML + CSS
        const { constructor } = this
        const cache = constructor.$code


        if (cache) {
            nextFrame(() => callback(cache))
        } else if (constructor.fetching) {
            constructor.$waitings.push(callback)
        } else {
            constructor.fetching = true
            constructor.$waitings = [callback]
            const $code = `
                ${await this.styleLinks() ?? ''}
                ${await this.html()}`

            this.constructor.assign({ $code })
            while (constructor.$waitings.length) {
                constructor.$waitings.shift()($code)
            }
        }
    }
    get dir () {
        return 'components'
    }
    get config () {
        return ({ limit : 20 }).assign(window.$config[this.tag] ?? {})
    }
    get container () {
        return Array.from(this.root.children).find(x => !/^(link|style)$/i.test(x.tagName)) // First one
    }
    build () {
        return this.mounted()
    }
    compiling () {  //TODO Fix it !!
        return this.mounting
    }
    get initFade () {
        return false
    }
    get $host () {
        return this.getRootNode().host
    }
    constructor (sth) {
        super()
        this.root = this.attachShadow({ mode: 'open' }) // this.shadowRoot
        this.pathname = location.pathname
        this.mounting = new Promise(mounted => this.assign({ mounted }))
//         console.log('this.$host =>', this, this.$host)
        this.fetchCode(code => {
            this.root.innerHTML = code
            
            this.build()
            this.$rendered = true
            if (this.initFade) {
                this.container.addClass('fade-in')
                setTimeout(() => {
                    this.container.removeClass('fade-in')
                    this.container.replaceClass('fade-in', 'displayed')
                }, this.fadeDuration ?? 700)   // get fadeDuration
            }
        })

        if (sth?.constructor.name === 'Object') {
            this.assign(sth)
        }

    }


    get mask () {
        return this.$('mask')
    }
    get limit () {
        return this.config.limit
    }

}
Component.extendMethods({   
    canSync (data, event) {
        console.log('Want me? Nope', data, event, this.constructor.name)
        return false
    },
    $monitor (event, fn) {
        const callback = (data = {}) => {
            if (this.canSync(data, event)) {    // .replace(':broadcast.', ':')
                fn?.(data)
            }
        }
        this.codebase = this.codebase ?? []
        this.codebase.push([event, callback])
        $on(event, callback)    // emit.js
    },
    $watch (dict) {
        // this.$host && 
        dict.loop(this.$monitor.bind(this))    //Exclude the Vue virtual
    },
    onDestroy () {  // Only for Screen
        this.codebase?.each(([event, callback]) => {
//             console.log('Destroy =>', this, this.$host,  event)
            $off(event, callback)
        })
        this.$$('x-table').each(child => child.onDestroy())
    },
    $keep (broadcast, update) { // $watch and invoke the update immediately
        this.$monitor(broadcast, update)        
        update()
    },
    bindMethod (method) {
        return this[method].bind(this).throttle()
    }
})
class VueComponent extends Component {
    constructor (info) {
        super()
        this.assign(info)
    }
    build () {
        const app = Vue.createApp({
            setup: () => {
                Vue.onMounted(() => {
                    this.mounted(`Built ${this.tag}`)  // Resolve
                })
                return this.setup().assign(window.$admin?.picked('is'))// code
            },
            data: () => {
                return this.config ?? {}
            }
        })
        app.config.isCustomElement = tag => {
            return  [
                'money', 'customer', 'grid', 'gap', 'unit', 'dot', 'to', 'one', 'two', 'value', 
                'comment', 'empty', 'upload', 'name', 'user', 'role', 'info', 'links', 
                'short', 'filter', 'list',
                'what', 'parent', 'child',
                'content', 'role', 'card'].includes(tag) || tag.includes('-') // || (Vue.version.includes('dev') && tag.includes('-')) // What??
        }

        app.mount(this.mountain())
        this.assign({ app })
    }
    mountain () {
        return this.container
    }
    setup () {
        console.warn('No Setup???', this)
        return {}
    }
}

class Architecture extends VueComponent {
    get dir () {
        return 'architecture'
    }    
}
class ToolComponent extends Component {
    get dir () {
        return 'components/tools'
    }    
}
class VueToolComponent extends VueComponent {
    get dir () {
        return 'components/tools'
    }    
}
class CoreComponent extends VueComponent {
    get dir () {
        return 'core'
    }    
}

// VueScreen may be conflict with canSync/$watch
class VueScreen extends VueComponent {
    get dir () {
        return 'screen'
    }
    get initFade () {
        return true
    }
}
class Screen extends Component {
    get dir () {
        return 'screen'
    }
    get initFade () {
        return true
    }
}

window.assign({ Component, ToolComponent, VueToolComponent, Architecture, CoreComponent, VueComponent, Screen, VueScreen });  // Must
