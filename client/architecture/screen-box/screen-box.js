class ScreenBox extends HTMLElement {
    constructor () {
        super()
        this.$screenList = {}
        this.$current = {}
        window.screenBox = this
        $on('@open', (uri, sth) => {
            if (sth) {
                sessionStorage.assign({ sth })
            }
            this.open(uri)
        })('@close-screen', (uri) => {
            console.log('close', uri)
            this.$screenList[uri]?.onDestroy?.()
            this.$screenList[uri]?.remove()
            delete this.$screenList[uri]
        })('@close-other-screens', () => {
            this.$screenList.loop((uri, dom) => {
                // if (!(document.body.contains(dom))) {
                if (!dom.is('.current')) {
                    this.$screenList[uri].onDestroy?.()
                    this.$screenList[uri].remove()
                    delete this.$screenList[uri]
                    console.log('Deleted', uri)
                }
            })
            // tabs.forEach(tab => delete this.$screenList[tab.uri])
        })
    }
    async open (uri) {
        if (this.$current.uri === uri) {
            console.log('Click the active one?')
            return
        }

        let screen = this.$screenList[uri]    //existed
        const newScreen = !screen
        if (!screen) {
            let [ name, ...arg ] = uri.split('/')    // Different screen with different arg
            if (!name.includes('-')) {
                name = `the-${name}`
            }
            const { default: Screen } = await import(`/screen/${name}/${name}.js`);
            screen = new Screen(...arg)
            this.$screenList[uri] = screen
            screen.assign({ uri })  // pathname

            this.append(screen)     // connectedCallback         
        }

        // const current = this.$current.screen
        // current?.remove()       // disconnectedCallback

        // this.append(screen)     // connectedCallback 
        $send.after(300, ':open-screen', { uri })

        screen.oneselfClass('current')
        this.$current = { uri, screen }
        window.$currentScreen = screen
        screen.onSelect?.(newScreen)
    }
}
// await $memo(':the-member', { mmid: 1 })

window.$fetchId = (n = 2) => Number.parseInt(location.pathname.split('/')[n]) || null

window.customElements.define('screen-box', ScreenBox);
export default ScreenBox;

