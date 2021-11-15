class InputCustomer extends VueComponent {
    async searchPhones (phone) {
        return await $memo(':search-customers', { phone })
    }
    async searchNames (name) {
        return await $memo(':search-customers', { name })
    }
    formatted (name, phone) {
        return `${name}【${phone}】`
    }
    setup () {
        window.$test = this
        const { name, phone, placeholder, csid } = this.attrs()
        const cssClass = Vue.ref('')
        const text = Vue.ref(name ?? '')
        const customerList = Vue.ref(name ? [{ name, phone, csid }] : [])

        Vue.onMounted(() => {
            this.$('input').detect(async value => {
                if (value.length === 0) {
                    customerList.value = []
                    return
                }
                const isNumber = /^\d+$/.test(value)
                if (isNumber) {
                    if (value.length >= 2) {
                        customerList.value = await this.searchPhones(value)
                    } else {
                        customerList.value = []
                    }
                } else if (value === customerList.value[0]?.name) {
                    console.log('Selected...', value)
                } else {    // Check name
                    customerList.value = await this.searchNames(value)
                }
            })
        })
        const check = () => {
            cssClass.value = customerList.value[0]?.name === text.value.trim() ? '' : 'invalid'
        }

        this.assign({ customerList, text })
        return { text, customerList, placeholder, cssClass, check }
    }
    get value () {
        const text = this.text.value.trim()
        if (text.length && text === this.customerList.value[0]?.name) {
            return this.customerList.value[0]
        } 
    }
}
window.customElements.define('input-customer', InputCustomer)
export default InputCustomer

