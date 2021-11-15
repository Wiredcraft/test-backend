class ConditionWhere extends Component {
    get moreCSS () {
        return '/css/form.css'
    }
    get $key () {
        return '##search-' + location.pathname.split('/')[1] // document.querySelector('screen-box > *').tagName this.tagName.toLocaleLowerCase()
    }

    async build () {

        this.$('filter').innerHTML = this.innerHTML
        const submit = this.outputWhere.bind(this)
            
        this.$$('select[id], day-picker[id]').on('day-pick select change', submit)    // <select>  <day-picker>
        this.$$('input[id]').each(input => input.detect(submit))

        const saving = JSON.parse(localStorage[this.$key] ?? '{}')

        this.$$('[id]').each(item => {
            if (saving[item.id]) {
                item.value = saving[item.id]
            }
        })

        setTimeout(() => this.outputWhere(), 100)   // TODO: Wait for the screen to load #search listening, HOW TO FIX?
    }
    parseReg (string) {
        return string.trim().replace(/'/g, `''`).replace(/ +/g, '|').replace(/`|\\/g, '').replace(/\| *$/, '')
    }
    outputWhere () {
        const cache = { }
        this.$$('*[id]').filter(({ value }) => value && value !== '-').map(({ value, id } ) => cache[id] = value)

        cache.saveStorage(this.$key)

        let where = ''
        this.$$('[id]').filter(({ value }) => value && value !== '-').each(({ value, id } ) => {
            if (id.match(/id$/)) {
                where += ` AND ${id} = ${value}`
            } else if (id === 'time-from') {
                where += ` AND time >= '${value}'`
            } else if (id === 'time-until') {
                where += ` AND time <= '${value} 23:59:59'`
            } else if (id === 'tag') {                
                where += ` AND tags @> '{${value}}'`
            } else if (id === 'yob') {              
                where += ` AND extract(year from dob) = '${value}'`
            } else if (id.oneOf('grade', 'status', 'sex', 'onoff')) {
                where += ` AND ${id} = '${value}'`
            } else if (id.includes('count_')) {
                where += ` AND ${id} ${value} `
            } else {
                where += ` AND ${id} ~* '${this.parseReg(value)}'`
            }
        })
        where = where.replace(/name (?=~\* '\d+')/, 'phone ')
        this.emit('#search', where)
    }
}

window.customElements.define('condition-where', ConditionWhere)
window.assign({ ConditionWhere })
export default ConditionWhere

