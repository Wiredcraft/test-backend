class CustomForm extends Component {
    static showDialog (...args) {
        return (new CustomForm(...args)).appendTo(document.body)
    }
    get moreCSS () {
        return ['/css/form.css']
    }
    constructor (info) {
        super()
        this.assign(info)
    }
    async build () {

        this.$('h2').textContent = this.name
        this.$('form').innerHTML = this.code
        this.$('dialog').cssVar('width', this.dialogWidth)
        // this.completeSelect()

        const button = this.$('button.ok')
        this.$('textarea')?.ctrlEnter(() => button.emit('click'))
        this.readForm(button, (values) => {
            const finish = () => {
                this.$('dialog').$fly()
                this.fadeOut()
            }
            const back = ({ id, tip }) => {
                Prompt.tip(tip)
                this.$('#' + id)?.focus()
                button.removeAttribute('disabled')
            }
            button.attr('disabled', '')
            
            this.callback(values, { finish, back })
        })

        const parentPicker = this.$('.pick-parent')
        const parentAvatar = this.$('.pick-parent + img')
        parentPicker?.on('click', async (e) => {
            e.preventDefault()
            const { name, ptid, avatar } = await ParentPicker.pick({ noCreate: true })
            // {name: "Can", ptid: 78, phone: "15089323800", avatar: "/avatar/customer/1/382"}
            console.log({ name, ptid, avatar } )
            this.$('#referrer').value = ptid
            parentPicker.textContent = name 
            parentAvatar.src = avatar
        })
        parentAvatar?.on('click', () => {
            this.$('#referrer').value = ''
            parentPicker.textContent = '(可选)'
            parentAvatar.src = '/avatar/parent/male.jpg'
        })
    }
}
Component.extendMethods({
    readForm (button, submit) {

        button.on('click', () => {
            const values = {}
            const items = this.$$('form [id]')
            const iPhone = this.$('#phone')
            const sex = this.$('#sex')
            items.each(item => {
                const { id } = item
                if (item.type === 'checkbox') {
                    values[id] = item.checked
                } else if (item.tagName === 'IMG') {
                    values[id] = item.src
                } else {
                    values[id] = item.value?.trim() || null
                }
            })
            button.disableTemporary()
            
            const { salesman, tutor } = values
            if (salesman === false && tutor === false) {    // not null or undefined
                return Prompt.tip('员工类型权限请至少选择一项')   
            } else if (salesman || tutor) {
                const roles = []
                salesman && roles.push(':salesman')
                tutor && roles.push(':tutor')
                values.roles = `{${roles.join(',')}}`
            }

            if (values.name === null || values.name.trim().length < 2) {
                this.$('#name').focus()
                return Prompt.tip('名字不能少于两个字')
            } else if (iPhone?.hasAttribute('required') && !values.phone) {
                iPhone.focus()
                return Prompt.tip('请输入手机号码')
            } else if (values.phone && !/^1\d{10}$/.test(values.phone)) {
                iPhone.focus()
                return Prompt.tip('请输入合法手机号码~')
            } else if (sex && !sex.value) {
                return Prompt.tip('请选择性别')
            } else {
                submit(values, items)
            }
        })
        this.$$('img#avatar, upload').on('click', async () => {
            const img = await $uploadImage()
            console.log({ img })
            this.$('img#avatar').src = img.src
        })     
    }
})
window.customElements.define('custom-form', CustomForm)
window.assign({ CustomForm })
export default CustomForm

