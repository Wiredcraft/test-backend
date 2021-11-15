class QuickSearch extends Component {
    get selected () {
        return this.$$('item').find(x => x.matches('.selected'))
    }
    async build () {
        const input = this.$('input')
        const mask = this.$('mask')
        const box = this.$('box')
        const leave = () => {
            document.off('keydown', keydown)
            this.fadeOut()
            box.$leave()
        }
        this.$leave = leave
        box.on('mousemove', e => {
            const item = e.findTag('item')
            if (item) {
                this.selected?.removeClass('selected')
                item.addClass('selected')
            }
        }).on('click', e => {
            e.stopPropagation()
            console.log(this.selected?.querySelector('value'))
            $open('customer/1')
            leave()
        })

        mask.on('click', leave)

        const keydown = (e) => {
            // console.log(e)
            const items = this.$$('item')
            const current = items.findIndex(x => x.matches('.selected'))    // -1
            const selected = items[current]

            switch (e.key) {
                case 'Escape':
                    console.log('Escape')
                    leave()
                    break
                case 'ArrowDown':
                    console.log('Down')
                    if (current < items.length - 1) {
                        items[current + 1].addClass('selected')
                        selected?.removeClass('selected')
                    }
                    input.focus()
                    break
                case 'ArrowUp':
                    if (current >= 1) {
                        items[current - 1].addClass('selected')
                        selected?.removeClass('selected')
                    }
                    console.log('Up')
                    input.focus()
                    break
                case 'Enter':
                    console.log('Go!!', selected?.querySelector('value'))
                    $open('room/48')
                    leave()
        
                    break
            }
        }
        document.on('keydown', keydown)
        input.focus()
    }
}

window.customElements.define('quick-search', QuickSearch)
window.assign({ QuickSearch })
export default QuickSearch

