class DayPicker extends Component {
    build () {
        window.test = this
//         console.log('Load Picker', this)
        this.value = this.$('value').innerText = (this.attr('value') || this.innerHTML || '').replace(/-/g, '/')
        if (this.value) {
            this.activeDate = new Date(this.value)
        }

        this.$('placeholder').innerText = this.attr('placeholder')
       
       
        const shiftMonths = count => {
            const active = new Date(`${this.current.year}/${this.current.month}/1`)
            active.setMonth(active.getMonth() + count)
            this.render(active.getFullYear(), active.getMonth() + 1)
        }
        const bye = () => {
            this.$('main').removeClass('show')
            document.off('keydown', arrowsEvent)
        }
        const empty = () => {
            bye()
            this.value = this.$('value').innerText = input.value = ''
            this.activeDate = null
            this.emit('day-pick', null)
        }
        const showCalendar = () => {
            Prompt.remindOnce('按箭头可切换年/月份, 或输入框填写日期', '@day-picker')
            this.$('main').addClass('show')
            document.on('keydown', arrowsEvent)
            const today = new Date()
            let year = today.getFullYear(), month = today.getMonth() + 1
            const value = this.$('value').innerText
            if (value) {
                [year, month] = value.split('/')
            }
            this.render(year, month)

            if (this.picker.right < 0) {    // Window absolute right
                this.picker.style.assign({
                    left: 'auto',
                    right: '-30px'          // Component right
                })
            }
        }

        const finish = date => {
            if (date instanceof Date) {
                date = dateFormat(date)
            }
            bye()
            this.value = this.$('value').innerText = input.value = date
            input.removeClass('wrong')
            this.activeDate = new Date(date)
            this.emit('day-pick', date)
        }
        const arrowsEvent = (e) => {
            if (input === this.$('input:focus')) {
                return
            }
            const { keyCode } = e
            const { left, up, down, right, esc } = KeyShortcuts
            if (keyCode === left) {
                shiftMonths(-1)
            } else if (keyCode === right) {
                shiftMonths(1)
            } else if (keyCode === up) {
                shiftMonths(-12)
            } else if (keyCode === down) {
                shiftMonths(12)
            } else if (keyCode === esc) {
               bye()
            } else {
                return
            }
            e.preventDefault()
        }

        this.$('box').on('click', showCalendar)
        this.$('.fullscreen').on('click', bye)
        this.$('prev').on('click', shiftMonths.with(-1))
        this.$('next').on('click', shiftMonths.with(1))
        
        this.picker = this.$('picker')
        // temp3.style.right = '-50px'

        const input = this.$('input')
        input.on('keydown', (event) => {
            const { value } = input
            const { key } = event
            if (key.oneOf(...'0123456789/-', 'Backspace', 'Delete', 'Enter', 'ArrowLeft', 'ArrowRight')) {                
                const valid = !Number.isNaN((new Date(value)).getTime())
            } else {
                event.preventDefault()
            }
        }).on('enter', (e) => {
            const valid = input.value.match(/\d{4}\/\d{1,2}\/\d{1,2}/) && !Number.isNaN((new Date(input.value)).getTime())
            console.log({ valid })
            if (!valid) {
                input.addClass('wrong')
            } else {
                input.removeClass('wrong')
                input.blur()
                finish(input.value)
            }
        }).on('esc', empty)

        this.$('#close').on('click', empty)
        
        input.value = this.attr('value')

        this.$('calendar').on('click', (e) => {
            const day = e.findTag('span')
            if (!day) { return }

            const { year, month } = this.current
            const date = new Date(`${year}/${month}/1`)
            if (day.hasAttribute('prev')) {
                date.setMonth(month - 2)
            } else if (day.hasAttribute('next')) {
                date.setMonth(month)
            }
            date.setDate(day.innerText)
            finish(date)
        })
       

    }
    render (year = (new Date().getFullYear()), month = (new Date().getMonth() + 1)) {

        this.current = { year, month }

        const days = daysInMonth(year, month)
        const lastMonthDays = daysInMonth(year, month - 1)
        const day1 = new Date(`${year}/${month}/1`) // This month
        day1.setDate(1)     

        let dayList = ''
        for (let i = 0; i < day1.getDay(); i++) {
            const day = lastMonthDays + 1 - day1.getDay() + i            
            const date = new Date(`${year}/${month}/1`)
            date.setMonth(month - 2)
            date.setDate(day)

            dayList += html`<span prev class="${isToday(date)} ${sameDays(date, this.activeDate) && 'selected'}">${ day }</span>`            
        }
        for (let i = 0; i < days; i++) {
            const day = i + 1
            const date = new Date(`${year}/${month}/${day}`)

            dayList += html`<span current class="${isToday(date)} ${sameDays(date, this.activeDate) && 'selected'}">${ day }</span>`            
        }
        for (let i = 0; i < (42 - day1.getDay() - days); i++) {
            const day = i + 1
            const date = new Date(`${year}/${month}/1`)
            date.setMonth(month)
            date.setDate(day)
            dayList += html`<span next class="${isToday(date)} ${sameDays(date, this.activeDate) && 'selected'}">${ day }</span>`            
        }
        this.$('month').innerText = `${year}/${day1.getMonth() + 1}`

        const weekDays = '日一二三四五六'.split('').map(d => html`<day>${d}</day>`).join('')

        this.$('calendar').innerHTML = weekDays + dayList
            
    }
}
function daysInMonth (year, month) {
    return new Date(year, month, 0).getDate()
}
function isToday (day) {
    const today = new Date()
    return sameDays(today, day) ? 'today' : ''
}

function sameDays(day1, day2) {
    return day1 && day2 && day1.getFullYear() === day2.getFullYear() && day1.getMonth() === day2.getMonth() && day1.getDate() === day2.getDate()
}
function dateFormat (date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

window.customElements.define('day-picker', DayPicker)
window.assign({ DayPicker })
export default DayPicker

