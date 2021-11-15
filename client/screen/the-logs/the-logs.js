class TheLogs extends Screen {
    async build () {        
        this.$watch({
            'broadcast': () => this.emit('#search', lastWhere)
        })

        const xtable = this.$('x-table')        

        let lastWhere
        this.$on('#search', where => {
            lastWhere = where
            xtable.make(async (n, sort, limit) => {
                const offset = n * limit
                const { total, actions } = await $memo(':the-logs', { offset, limit, where })
                const data = actions.map(({ id, cover, member, name, action, data, time }, index) => ([
                        { column: '@index',   $title: '序号', index: index + offset },
                        { column: '@member',  $title: '会员用户', name, mmid: member, cover },
                        { column: '@action',  $title: '操作', action },
                        { column: '@data',    $title: '数据', data },
                        { column: '@daytime', $title: '时间', value: time }
                    ]
                ))
                return { data, total }
            })
        })
    }
    canSync () {
        return true
    }
}


TheLogs.$publish()
export default TheLogs


