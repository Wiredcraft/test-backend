class CloseButton extends ToolComponent {
    build () {
        this.$('main').on('click', () => {
            // this.emit('close')
            const { host } = this.getRootNode()
            host.fadeOut()
            host.$('dialog').$leave()
        })
    }
}
window.customElements.define('close-button', CloseButton)
export default CloseButton

