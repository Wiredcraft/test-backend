const kTabStorage = 'tab-bar'
const $reload = false
if ($reload) {
    localStorage[kTabStorage] = `[{"uri":"create-customer","name":"新生报名"},{"uri":"admin-account","name":"管理员账号"},{"uri":"the-rooms","name":"客房管理"},{"uri":"room-statistics","name":"消费统计"},{"uri":"home-overview","name":"首页"},{"uri":"search-screen","name":"搜索"},{"uri":"top-up","name":"充值缴费"},{"uri":"members-of-parent","name":"咨询列表"},{"uri":"bill-statistics","name":"账单统计"},{"uri":"customer-statistics","name":"学员统计"},{"uri":"campus-setting","name":"校区列表"},{"uri":"admin-log","name":"操作日志"},{"uri":"system-settings","name":"系统设置"}]`
}
const initTabs = JSON.parse(localStorage[kTabStorage] ?? 'null') ?? $config['tab-bar'].default
const kTabTitles = {
    'create-room': '创建客房'
}
function titleOf (uri) {
    const main = uri.split('/').filter(x => x)[0]
//     console.log({ main, title: kTabTitles[main]  })
    return kTabTitles[main] ?? window.$config['left-bar'].menu.map(x => x.items).flat().find(({ screen }) => screen === main)?.title ?? '-'
}
const $uri = () => location.pathname.slice(1)

class TabBar extends Architecture {

    setup () {

        const tabs = Vue.reactive(initTabs)
        const scrollBar = Vue.ref(null)
        const closingIndex = Vue.ref(-1)
        const closingWidth = Vue.ref(0)
        const saveTabs = () => localStorage[kTabStorage] = JSON.stringify(tabs)
        const current = Vue.ref($initScreen)

        const scrollTo = async (uri) => {
            const kMargin = 200

            const index = tabs.findIndex(tab => tab.uri === uri)
            const tabDOM = scrollBar.value
            if (!tabDOM) {
                nextFrame(() => scrollTo(uri))
                return 
            }
            await sleep(300)
            const { screenLeft: barLeft, screenRight: barRight } = tabDOM
            const { screenLeft: tabLeft, screenRight: tabRight } = tabDOM.querySelector('nav').children[index]

            const { scrollLeft } = tabDOM
            Progress.watch((rate) => {
                if (tabLeft < barLeft + kMargin) {
                    tabDOM.scrollLeft = scrollLeft - (barLeft + kMargin - tabLeft) * rate
                } else if (tabRight > barRight - kMargin) {
                    tabDOM.scrollLeft = scrollLeft + (tabRight - (barRight - kMargin)) * rate
                }
            }, { duration: 0.5 })
        }

        const open = (uri) => {
            if (uri === current.value) {
                return console.log('Open the same??')
            }
            $open(uri)
        }
        const close = (uri, index) => {            
            $emit('@close-screen', uri)   // screen-box
            $emit('@close-tab', index)   // screen-box
            if (uri === current.value) {    // What if only 1
                const openIndex = index === (tabs.length - 1) ? index - 1 : index + 1
                open(tabs[openIndex]?.uri ?? 'home-overview')
            }
        }
        // const clear = () => $emit('@close-others')

        $on('@open', (uri) => {
            const name = titleOf(uri)
            if (!tabs.find(tab => tab.uri === uri)) {
                tabs.push({ uri, name })
            }
            current.value = uri
            const path = '/' + (uri === 'home-overview' ? '' : uri)
            history.pushState({ name, uri }, '', path)
            scrollTo(uri)           
        })('@update-tab-title', (name, uri = $uri()) => {
            tabs.forEach(tab => {
                if (tab.uri === uri) {
                    tab.name = name
                }
            })
            saveTabs()
        })('@close-current', () => {
            const index = tabs.findIndex(({ uri }) => uri === current.value)
            close(current.value, index)
        })('@replace', uri => { // TODO Optimize it
            const index = tabs.findIndex(({ uri }) => uri === current.value)
            $emit('@close-screen', current.value)   // screen-box
            $emit('@close-tab', index)   // screen-box
            $open(uri)
        })('@close-others', () => {
            tabs[0] = tabs.find(({ uri }) => uri === current.value)
            tabs.length = 1
            $emit('@close-other-screens')
        })('@close-tab', (index) => { // close animate
            closingIndex.value = index
            const titleDOM = scrollBar.value.querySelector('nav').children[index]
            closingWidth.value = titleDOM.clientWidth 
        })
        
        $emit.after(500, '@open', current.value)
        
        Vue.watch(() => tabs.length, saveTabs)

        window.onpopstate = e => {
            e.state?.uri && open(e.state.uri)
        }

        const onClosed = (index, event) => {
            if (event.animationName === 'sketch-in') {
                tabs.removeAt(index)
                closingIndex.value = -1
            }
        }
        
        return { tabs, open, close, current, scrollBar, onClosed, closingIndex, closingWidth, emit }
    }
}
window.customElements.define('tab-bar', TabBar);
