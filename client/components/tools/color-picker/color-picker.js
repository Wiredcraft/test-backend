class ColorPicker extends ToolComponent {
    build () {
        super.build()
        const input = this.$('input')
        this.assign({ input })
        input.on('input', () => {
            this.emit('color', input.value)
        })
        input.value = this.cssVar('color') 
    }
    get value () {
        return this.input.value
    }
    set value (value) {
        this.input.assign({ value })
        this.emit('color', value)
    }
}
window.customElements.define('color-picker', ColorPicker)
export default ColorPicker

