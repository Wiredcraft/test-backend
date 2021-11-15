class TheSessions extends Screen {
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
                const { total, sessions } = await $memo(':the-sessions', { offset, limit, where })
                console.log(sessions)
                const data = sessions.map(({ id, cover, mmid, name, timeIn, duration, timeOut }, index) => ([
                        { column: '@index',   $title: '序号', index: index + offset },
                        { column: '@member',  $title: '会员用户', name, mmid, cover },
                        { column: '@text',  $title: '时长', value: duration },
                        { column: '@daytime', $title: '登入时间', value: timeIn },
                        { column: '@date', $title: '退出时间', value: timeOut }
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


TheSessions.$publish()
export default TheSessions


