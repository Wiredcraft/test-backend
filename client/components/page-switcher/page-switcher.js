let kMaxPages = 10  // Configurable

class PageSwitcher extends VueComponent {
    setup () {
        const info = Vue.ref()
        const indexes = Vue.ref([])
        const page = Vue.ref()
        const inputRef = Vue.ref()
        const empty = Vue.ref('')
        
        const select = n => {
            this.$goto(n)            
            this.onUpdate?.(n, this.limit)
        }
        this.assign({ info, indexes, page, select, empty }) 


        const goto = () => {
            const index = Number.parseInt(inputRef.value.value)

            if (Number.isNaN(index)) {
                console.log('Illegal text', inputRef.value.value)
            } else if (index > this.pageCount || index < 1) {
                console.log(`${index} => ${this.pageCount}?`)
            } else {
                select(index - 1)
            }
        }

        Vue.onMounted(() => {
            const input = inputRef.value
            input.enter(goto).esc(() => input.value = '')

            this.$('capacity').on('click', e => {
                const button =  e.findTag('button')
                if (button && !button.is('.selected')) {
                    // console.log('Update page limit...')
                    button.oneselfClass('selected')
                    select(0)
                }
            })
        })

        return { 
            prev: () => select(this.page.value - 1),
            next: () => select(this.page.value + 1),
            inputRef,
            select,
            goto,
            kMaxPages,
            // empty,
            ...this 
        }
    }
    get limit () {
        return Number.parseInt(this.$('capacity .selected')?.innerText) || 20
    }
    async go ({ total, page = 0, onUpdate } = {}) {
        await this.compiling()
        const pageCount = Math.ceil(total / this.limit)
        
        this.assign({ onUpdate, pageCount, total })
        
        this.indexes.value = pageCount.times(Function.identity)
        this.empty.value = total === 0 ? 'empty' : ''                
        this.$goto(page)    
        this.style.display = pageCount <= 1 ? 'none' : 'block'
    }
    
    $goto (n) {      
        this.info.value = this.pageCount ? `共${this.total}条 ${n + 1}/${this.pageCount}页` : '(空)'
        this.page.value = n        
    }
}
window.customElements.define('page-switcher', PageSwitcher);
export default PageSwitcher;

