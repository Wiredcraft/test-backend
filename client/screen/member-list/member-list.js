class MemberList extends Screen {
    get moreCSS () {
        return '/css/form.css'
    }
    async build () {
        const xtable = this.$('x-table')

        const search = async where => {
            where = where ?? search.where 
            search.assign({ where })
            // where = where.replace('room.status', 'status').replace(' AND room ', ' AND title ')
            xtable.make(async (n, sort, limit) => {
                const offset = n * limit
                const { total, members } = await $memo(':member-list', { offset, where, limit, sort })
                // | id |  name  |    phone    | password | dob | address | coordinate | info |       createAt        | description | onoff
                const data = members.map(({ name, id, dob, createAt, cover, coordinate, info, onoff, description }, index) => ([
                        { column: '@index', $title: '序号', index: index + offset, class: onoff.slice(1) },
                        { column: '@member',  $title: '会员用户', name, mmid: id, cover },
                        { column: '@day',  $title: '生日', value: dob, sort: 'dob' },
                        { column: '@data',  $title: '关注人数', data: info.count.following, sort: 'following' },
                        { column: '@data',  $title: '粉丝人数', data: info.count.followed, sort: 'followed' },
                        { column: '@day',   $title: '创建时间', value: createAt, sort: `createAt`  },
                        { column: '@text',  $title: '状态', value: onoff === ':on' ? '在线' : '离线' },
                        { column: '@member-comment',  $title: '备注', comment: description, title: name + ' 备注', id },
                    ]
                ))
//                 console.log(data)
                return { data, total }
            })
        }
        
        this.$on('#search', search)
        this.$('button').on('click', () => {
            let latitude, longitude
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                ({ latitude, longitude } = coords)
                console.log({ latitude, longitude })
            }, console.error);
            CustomForm.showDialog({ 
                dialogWidth: '460px',
                name: '新建用户',
                code: html`
                <div>
                    <span>名字</span>
                    <input id="name" placeholder="(必填)" />
                </div>
                <div>
                    <span>手机</span>
                    <input id="phone" type="number" maxlength="11" />
                </div>
                <div>
                    <span>生日</span>
                    <day-picker id="dob" style="--width: 300px;">2000/1/1</day-picker>
                </div>
                <div>
                    <span>地址</span>
                    <input id="address" />
                </div>
                <div class="column">
                    <span>简介</span>
                    <textarea id="description"></textarea>
                </div>
                `,
            async callback (data, { finish }) {
                console.log(data)
                $broadcast(':create-member', { latitude, longitude, ...data })
                finish()
            }})
        })
        
        this.$watch({
            ':create-member': ({ $self, url }) => {
                search()
                if ($self) {
                    $open(url)
                }
            }
        })

        let yobHTML = this.$('#yob').innerHTML  // <option value="-">年份(全部)</option>
        for (let i = 1980; i <= 2004; i++) {
            yobHTML += `\n<option>${i}</option>`
        }
        this.$('#yob').innerHTML = yobHTML

    }
    canSync (data, event) {
        console.log({ event, data })
        return true
    }
}
MemberList.$publish()
export default MemberList;
