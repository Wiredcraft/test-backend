const assert = require('assert');
const should = require('should')
const serialize = require('serialize-javascript');
const app = require('../../app')
const request = require('supertest')(app)
const beforeStart = require('../../beforeStart')
const CONFIG = require('../../config')
const cache = require('../../lib/cache/index')
const {getAllSepecificRouters} = require('../../request-filter/UserIdentityInterceptor')

describe('用户模块', function () {

    const test_users = [
        {name: 'first guy', dob: '2021-01-01', address: 'abc', description: 'first guy'},
        {name: 'second guy', dob: '2021-01-02', address: 'def', description: 'second guy'},
    ]
    let User
    let BaseRepository
    before(done => {
        beforeStart.prepare().then(() => done())
    })
    beforeEach((done) => {
        cache.setCache(cache.CURRENT_TENANT_SCHEMA_KEY, CONFIG.MYSQL_CONFIG.database)
        getAllSepecificRouters()
        User = require('../../orm/model/User')
        BaseRepository = require('../../orm/BaseRepository')
        done()
    })

    describe('API', function () {
        describe('新增2条记录', function () {

            let base_url = 'http://127.0.0.1:3001'
            before(done => {
                done()
            })

            test_users.forEach(test_user => {
                it(`新增${test_user.name}`, function (done) {
                    request.post('/user')
                        .send(test_user)
                        .expect(200)
                        .end((err, res) => {
                            assert(!err)
                            res.body.code.should.equal(0)
                            test_user.id = res.body.data.id
                            done()
                        })

                })
            })

            it('验证数据库插入记录', function (done) {
                request.post('/user/list')
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.list.length.should.equal(test_users.length)
                        done()
                    })

            })



        })

        describe('修改2条记录', function () {
            test_users.forEach(test_user => {
                it(`'修改${test_user.name}`, function (done) {
                    request.put('/user')
                        .send({...test_user, address: test_user.address + '-E'})
                        .expect(200)
                        .end((err, res) => {
                            assert(!err)
                            res.body.code.should.equal(0)
                            done()
                        })

                })
            })

            it('在数据库验证修改结果', async function () {
                const u1 = await User.findOne({ where: { address: test_users[0].address+'-E' } })
                const u2 = await User.findOne({ where: { address: test_users[1].address+'-E' } })
                return new Promise((resolve, reject) => {
                    u1 && u2 && resolve() || reject('查询失败')
                })
            })

            it('调用列表查询接口,加上筛选参数,验证修改结果', function (done) {
                request.post('/user/list')
                    .send({filters: [{key: 'address',exp: 'like', value: '%-E'}]})
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.list.length.should.equal(test_users.length)
                        done()
                    })

            })
        })


        describe('查询一条记录的详情', function () {
            it('应返回详情', function (done) {
                request.get(`/user/${test_users[0].id}`)
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.name.should.equal(test_users[0].name)
                        done()
                    })

            })
        })

        describe('调用删除接口批量删除刚刚的2条记录', function () {
            it('应删除成功', function (done) {
                request.delete('/user')
                    .send({ids: test_users.map(user => user.id)})
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        done()
                    })

            })

            it('调用列表查询接口,检查逻辑删除是否成功', function (done) {
                request.post('/user/list')
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.list.length.should.equal(0)
                        done()
                    })

            })
        })




    })

    after( (done) => {
        User.destroy(
            {
                where:
                    {
                        name: {
                            [BaseRepository.Op.in]: test_users.map(user => user.name)
                        }
                    }, force: true
            }).then(ret=>{
            done()
        })
    })

})





