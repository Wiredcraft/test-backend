const [$lastSelected, $storeSelected] = $buildTabRemember('member')
class TheMember extends Screen {
    get moreCSS () {
        return ['/css/info.css', '/css/form.css']
    }
    
    canSync(data, event) {
        console.log({ data, event })    // Maybe follow him
        return true // data.mmid === this.mmid || data.from === this.mmid
    }
    async loadBasic () {
        const { mmid } = this
        const member = await $memo(':the-member', { mmid })
        if (!member) {
            Prompt.tip('该用户不存在/已被删除')
            return $emit('@close-current')
        }
        this.assign({ member })
        this.$('.profile').setAttribute('sex', member.sex)
        member.createAt = member.createAt.date
        'address phone description dob createAt'.split(' ').forEach(sth => this.$('#' + sth).textContent = member[sth] || '-')

        this.$('#name').textContent = member.name + (member.self ? '(Myself)' : '')

        this.$('#cover').src = member.cover
        const { count } = member.info
        // this.$('#tab-near').attr('data-count', count.near)
        this.$('#tab-following').attr('data-count', count.following)
        this.$('#tab-followed').attr('data-count', count.followed)

        const { followingMe, followedByMe } = member 
        if (followedByMe) {
            this.$('.meta').setAttribute('following', 'yes')
        } else {
            this.$('.meta').removeAttribute('following')
        }
        $emit('@update-tab-title', `[${followingMe ? (followedByMe ? '互相关注' : '粉丝') : followedByMe ? '偶像' : '用户' }] ${member.name}`)
        if (member.self) {
            this.$('div.profile').setAttribute('self', '')
        }
    }
    async build () {
        const mmid = $fetchId()        
        this.assign({ mmid, loadedTabs: [] })
        await this.loadBasic()
        if (!this.member) {
            return
        }
        this.tabs = this.$$('.tab-list button')
        this.$('.tab-list').on('click', e => {
            const button = e.findTag('button')
            if (button) {
                this.switch(button.id.replace('tab-', ''))
            }
        })
        
        this.$('#edit').on('click', () => {
            const { member, mmid } = this
            CustomForm.showDialog({ 
                dialogWidth: '460px',
                name: '修改用户',
                code: html`
                <div>
                    <span>名字</span>
                    <input id="name" placeholder="(必填)" value="${member.name}" />
                </div>
                <div>
                    <span>手机</span>
                    <input id="phone" type="number" maxlength="11" value="${member.phone}" />
                </div>
                <div>
                    <span>生日</span>
                    <day-picker id="dob">${member.dob}</day-picker>
                </div>
                <div>
                    <span>地址</span>
                    <input id="address" value="${ member.address }" />
                </div>
                <div class="column">
                    <span>简介</span>
                    <textarea id="description">${ member.description ?? ''}</textarea>
                </div>
                `,
            async callback (data, { finish }) {
                console.log({ ...data, mmid })
                $broadcast(':edit', { mmid, ...data })
                finish()
            }})
        })
        this.$('#delete').on('click', async () => {
            await Prompt.confirm(`确定要删除 ${this.member.name} ?!`)
            $broadcast(':delete-member', { mmid })
        })
        this.$('#follow').on('click', $broadcast.with(':follow', { mmid }))
        this.$('#unfollow').on('click',  $broadcast.with(':unfollow', { mmid }))

        setTimeout(() => this.switch($lastSelected(mmid, 'near')), 200)  // Load from localStorage

        const updateFans = () => {
            console.log('Update fans...')
            this.loadBasic()
            if (this.loadedTabs.includes('followed')) {
                this.loadFollowed()
            }
        }
        this.$watch({
            ':edit': () => this.loadBasic(),
            ':follow': updateFans,
            ':unfollow': updateFans,
            ':delete-member': ({ mmid }) => {
                // Update follower/following??
                if (mmid === this.mmid) {
                    Prompt.tip('删除成功')
                    $emit('#refresh', 'DELETE member')
                    $emit('@close-current')
                }
            }
        })
    }
    switch (which) {
        if (this.current === which) {
            return console.log('Already....', which)
        }
        this.current = which 
        $storeSelected(this.mmid, which)
        this.$(`#tab-${which}`).oneselfClass('selected')
        this.$(`#${which}`).oneselfClass('current')
        if (this.loadedTabs.includes(which)) {
            return console.log('Already loaded ', which)
        }
        this.loadedTabs.push(which)
        if (which === 'near') {
            this.loadNearbyFriends()
        } else if (which === 'following') {
            this.loadFollowing()
        } else if (which === 'followed') {
            this.loadFollowed()
        }
    }
    async loadNearbyFriends () {
        const { mmid } = this
        const xtable = this.$('#near x-table')
        xtable.make(async (n, sort, limit) => {
            const offset = n * limit
            const { total, near } = await $memo(':nearby-friends', { mmid, limit, offset })
            const data = near.map(({ name, id, dob, createAt, cover, coordinate, info, onoff, description }, index) => ([
                { column: '@index', $title: '序号', index: index + offset, class: onoff.slice(1) },
                { column: '@member',  $title: '会员用户', name, mmid: id, cover },
                { column: '@day',  $title: '生日', value: dob, sort: 'dob' },
                { column: '@data',  $title: '关注人数', data: info.count.following },
                { column: '@data',  $title: '粉丝人数', data: info.count.followed },
                { column: '@day',   $title: '创建时间', value: createAt },
                { column: '@text',  $title: '状态', value: onoff === ':on' ? '在线' : '离线' },
                { column: '@member-comment',  $title: '备注', comment: `${description || '=>'} (${coordinate})`, title: name + ' 备注', id },
            ]))

            this.$('#tab-near').attr('data-count', total)
            return { total, data }
        })
    }
    async loadFollowed () {
        const { mmid } = this
        const xtable = this.$('#followed x-table')
        xtable.make(async (n, sort, limit) => {
            const offset = n * limit
            const { total, members } = await $memo(':followed-of', { mmid, limit, offset })
            const data = members.map(({ name, id, dob, createAt, cover, info, onoff, description }, index) => ([
                { column: '@index', $title: '序号', index: index + offset, class: onoff.slice(1) },
                { column: '@member',  $title: '会员用户', name, mmid: id, cover },
                { column: '@day',  $title: '生日', value: dob, sort: 'dob' },
                { column: '@data',  $title: '关注人数', data: info.count.following },
                { column: '@data',  $title: '粉丝人数', data: info.count.followed },
                { column: '@day',   $title: '创建时间', value: createAt },
                { column: '@text',  $title: '状态', value: onoff === ':on' ? '在线' : '离线' },
                { column: '@member-comment',  $title: '备注', comment: description, title: name + ' 备注', id },
            ]))
            return { total, data }
        })
    }
    async loadFollowing () {
        const { mmid } = this

        const xtable = this.$('#following x-table')
        xtable.make(async (n, sort, limit) => {
            const offset = n * limit
            const { total, members } = await $memo(':following-of', { mmid, limit, offset })
            const data = members.map(({ name, id, dob, createAt, cover, info, onoff, description }, index) => ([
                { column: '@index', $title: '序号', index: index + offset, class: onoff.slice(1) },
                { column: '@member',  $title: '会员用户', name, mmid: id, cover },
                { column: '@day',  $title: '生日', value: dob, sort: 'dob' },
                { column: '@data',  $title: '关注人数', data: info.count.following },
                { column: '@data',  $title: '粉丝人数', data: info.count.followed },
                { column: '@day',   $title: '创建时间', value: createAt },
                { column: '@text',  $title: '状态', value: onoff === ':on' ? '在线' : '离线' },
                { column: '@member-comment',  $title: '备注', comment: description, title: name + ' 备注', id },
            ]))
            return { total, data }
        })
    }
}

TheMember.$publish()
export default TheMember

