class SearchBar extends ToolComponent {
    build () {
        const input = this.$('input')
        const clear = this.$('.clear')
        let last = ''
        const search = (value = '') => {
            if (value !== last) {
                this.emit('@search', value)
                this.onInput?.(value)
                last = value
            }
        }
        input.attr('placeholder', this.attr('placeholder') ?? $config.searchPlaceholder )
             .detect(search)

        clear.on('click', () => {
            input.value = ''
            search()
        })
    }
}
window.customElements.define('search-bar', SearchBar);
export default SearchBar;
