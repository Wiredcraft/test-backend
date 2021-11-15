class CustomersPicker extends Component {
    static pick ({ current = []} = {}) {
        return new Promise(done => {
            document.body.append(new CustomersPicker({ current, done }))
        })
    }
    async build () {
        const customers = await $memo(':all-online-customers')
        const $select = this.$('#select')
        const $active = this.$('#active')
        const $picking = this.$('#picking')
        const $already = this.$('#already')
        const updateNumber = () => this.$('number').innerText = $active.querySelectorAll('item').length
        this.$on('@search', text => {            
            const items = this.$$('#select item, #picking item')
            if (text.length) {
                items.each(item => {
                    item.className = item.innerText.contains(text) ? 'matched' : 'nope'
                })
            } else {
                items.each(item => item.removeAttr('class'))
            }
        })
        customers.each(({ name, avatar, phone, csid, status }) => {
            const code = html`<item csid="${csid}">
            <img src="${avatar}" />
            <name>${name}</name>
            <phone>${phone ?? '-'}</phone>
            <svg-icon icon="trash"></svg-icon>
        </item>`
            if (this.current.includes(csid)) {''
                $already.innerHTML += code
            } else if (status === ':on') {
                $select.innerHTML += code
            }
        })
        updateNumber()
        $select.on('click', (e) => {
            const item = e.findTag('item')
            if (item) {
                item.prependTo($picking)
                updateNumber()
            }
        })
        $picking.on('click', (e) => {
            const trash = e.findTag('svg-icon')
            if (trash) {
                trash.parentElement.prependTo($select)
                updateNumber()
            }
        })
        this.$('.ok').on('click', 'submit'.bind(this))
    }
    submit () {
        const csids = this.$('#picking').pluck('csid')
        if (csids.length > 0) {
            this.done(csids)
        }
        this.$('dialog').$fly()
        this.fadeOut()
    }
}
window.customElements.define('customers-picker', CustomersPicker)
window.assign({ CustomersPicker })

