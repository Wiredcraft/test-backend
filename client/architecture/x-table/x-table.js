const $next = (array, current) => {
    const index = array.indexOf(current)
    return array[(index + 1) % array.length]
}

class XTable extends Architecture {
    get container () {
        return this.$('table')
    }

    setup () {
        this.columns = this.attr('columns')?.split(',')
        this.data = Vue.reactive([])
        
        this.sortColumn = Vue.ref(null)
        this.sortOrder = Vue.ref(null)
        this.orderBy = column => {
            console.log('Order by ', column)
            if (this.sortColumn.value === column) {
                this.sortOrder.value = $next([null, 'asc', 'desc'], this.sortOrder.value) //  this.sortOrder.value === 'asc' ? 'desc' : (this.sortOrder.value === 'desc' ? null : 'asc')
            } else {
                this.sortColumn.value = column 
                this.sortOrder.value = 'asc'
            }
            this.make()
        }
        this.toMember = mmid => $open(`member/${mmid}`)
        this.prompt = (async (item, kind) => {
            let { title } = item
            let content = item[kind]
            await Prompt.read({ 
                title: title,
                content,
                readonly: true
            })

        }).throttle()
        this.toAdmin = adid => $open(`admin/${adid}`)
        return this
    }

    get pager () {
        return this.$('page-switcher')
    }
    async resetData (data = []) {
        await this.compiling()
        this.data.splice(0, this.data.length, ...data)
        this.$('main').className =  this.data.length === 0 ? 'none' : ''
    }

    async make (callback = this.callback, page = (this.currentPage ?? 0)) {
        this.currentPage = page // Keep the current page
        this.assign({ callback })
        const { limit } = this.pager
        const sort = this.sortOrder.value ? `${this.sortColumn.value} ${this.sortOrder.value}` : ''
        const { total, data } = await callback(page, sort, limit)

        if (data.length === 0 && page > 0 && total > 0) {
            return this.make(callback, Math.ceil(total / limit) - 1)
        }
        await this.resetData(data)
        this.pager.go({ 
            total, 
            page, 
            onUpdate: (n, limit) => {
                console.log({ n, limit })
                this.make(callback, n)
            }
        })
    }
}


window.customElements.define('x-table', XTable);
export default XTable;
