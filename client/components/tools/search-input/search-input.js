class SearchInput extends ToolComponent {
    build () {
        this.$('input').detect(this.emit.bind(this, '@search'))
            .attr('placeholder', this.attr('placeholder') ?? '' )
    }
    focus () {
        this.$('input')?.focus()
    }
}

window.customElements.define('search-input', SearchInput)
window.assign({ SearchInput })
export default SearchInput

