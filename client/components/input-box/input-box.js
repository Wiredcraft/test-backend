class InputBox extends Component {

    shadowSelectors (...selectors) {
        selectors.each(selector => this[selector] = this.$(selector))
    }
    async build () {
        this.shadowSelectors('main', 'input', 'span')
        const title = this.attr('placeholder') || ''
        this.span.attr('data-title', title)
        this.input.on('blur', () => this.main.className = this.input.value.trim() && 'valued')
                  .enter(e => (this.enterCallback || console.log)(e))
                  .esc(e => (this.escCallback || console.log)(e))

        this.input.type = this.attr('type') || 'text'
        this.color = this.attr('color')
        if (this.hasAttribute('password') || ['密码', 'password'].includes(title.toLowerCase())) {
            this.input.type = 'password'
        }

        this.input.value = this.innerHTML.unparseHTML().unparseHTML() //this.innerHTML
        if (this.input.value.trim()) {
            this.main.className = 'valued'
        }
        this.input.detect(() => this.emit('input-box', this.value, { composed: true, bubbles: true }))
        if (this.id === 'phone') {
            this.input.attr('maxlength', 11)
        }
    }
    on ({ enterCallback, escCallback }) {
        return this.assign({ enterCallback, escCallback })
    }
    get value () {
        return this.input ? this.input.value.trim() : this.innerHTML
    }
    set value (text) {
        Until(() => this.input, () => this.input.value = text)        
    }
    focus () {
        if (!this.input) {
            console.log('wait focus')
            return nextFrame(() => this.focus())
        }
        someFrames(10, () => this.input.focus())
    }
    select () {
        this.input.select()
    }
    set color (rgb) {
        rgb && this.cssVar('color', rgb)
    }
    setPlaceholder (placehoder) {
        this.span.attr('data-title', placehoder)
    }
}

window.customElements.define('input-box', InputBox);
export default InputBox;
