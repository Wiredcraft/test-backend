const kScreenGroup = {
    'customer': 2,
    'order': 2,
    'room': 2,
    'branch': 1
}
class LeftBar extends Architecture {

    setup () {
        
        const data = Vue.reactive({
            name: '程序员',
            meta: 'Hacker',
            avatar: '/src/1.jpg' // '/avatar/manager/female.jpg',
        })
        
        const selected = Vue.ref($initScreen)

        const findGroup = (uri) => {
            let index = this.config.menu.findIndex(({ items }) => {
                return items.find(x => x.screen === uri) !== undefined 
            })
            if (index === -1) {
                index = kScreenGroup[uri.split('/')[0]]
            }
            return index
        }
        const groupIndex = Vue.ref(findGroup($initScreen))
        $on('@login', (info) => {
            data.assign(info)
        })

        const open = ({ signal, screen }) => {
            if (signal) {
                $emit('@' + signal) // quick-search
            } else if (screen) {
                $open(screen)
            }
        }
        
        $on('@open', (uri) => {
            selected.value = uri
            groupIndex.value = findGroup(uri)
        })
        
        this.$watch({
            ':edit': ({ name }) => data.assign({ name })
        })
        const gotoMyself = () => {
            $open(`member/${$admin.mmid}`)
        }

        return { data, open, selected, groupIndex, gotoMyself }
    }
    canSync ({ self }, event) {    // When Update Org Name?

        return self
    }
}
window.customElements.define('left-bar', LeftBar);

