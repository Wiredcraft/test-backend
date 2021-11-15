class OnoffItem extends Component {
    build () {
        const { time, text, salesman, status } = this

        // <span>[${(status === ':off' ? '关闭' : '重开')}]</span> 
        this.$('#title').innerHTML = html`${text?.simpleHTML}`
        this.$('#who').textContent = `${salesman.name} ${status === ':off' ? '关闭' : '重开'}`
        this.$('#meta').textContent = time.date//daytime(true)
        this.$('main').className = status.slice(1)
    }
}

window.customElements.define('onoff-item', OnoffItem)
window.assign({ OnoffItem })
export default OnoffItem

