const assert = require('assert');
const should = require('should')
const serialize = require('serialize-javascript');
const app = require('../../app')
const request = require('supertest')(app)
const beforeStart = require('../../beforeStart')
const CONFIG = require('../../config')
const cache = require('../../lib/cache/index')
const {getAllSepecificRouters} = require('../../request-filter/UserIdentityInterceptor')
const lodash = require('lodash')

describe('用户关系测试', function () {

    const test_users = lodash.range(1, 10).map(i => new Object(
        {name: `user-${i}`, dob: '2021-01-01', address: 'abc', description: `user-${i}`,
        lng: 90.123456 + (i*0.002), lat: 40.123456 + (i*0.002)}))
    let User
    let UserFollow
    let BaseRepository
    before(done => {
        beforeStart.prepare().then(() => done())
    })
    beforeEach((done) => {
        cache.setCache(cache.CURRENT_TENANT_SCHEMA_KEY, CONFIG.MYSQL_CONFIG.database)
        getAllSepecificRouters()
        User = require('../../orm/model/User')
        UserFollow = require('../../orm/model/UserFollow')
        BaseRepository = require('../../orm/BaseRepository')
        done()
    })

    describe('API', function () {
        describe(`新增${test_users.length}条用户记录`, function () {

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

        describe('建立互相关注的关系', function () {
            test_users.forEach(test_user => {
                it(`${test_user.name}`, function (done) {
                    const follow_targets = test_users.filter(user => user.id !== test_user.id).map(user => user.id)
                    request.put('/user')
                        .send({...test_user,
                            follows: test_user.name === 'user-1' ? [follow_targets.pop()] : follow_targets,
                        })
                        .expect(200)
                        .end((err, res) => {
                            assert(!err)
                            res.body.code.should.equal(0)
                            done()
                        })

                })
            })

            it('查询关系列表,验证是否返回了关注关系', function (done) {
                request.post('/user/relations/list')
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.list.length.should.equal(test_users.length)
                        res.body.data.list[0].follows.length.should.equal(1)
                        res.body.data.list[0].followers.length.should.equal(8)
                        res.body.data.list[1].follows.length.should.equal(8)
                        res.body.data.list[1].followers.length.should.equal(7)
                        res.body.data.list[test_users.length-1].follows.length.should.equal(8)
                        res.body.data.list[test_users.length-1].followers.length.should.equal(8)
                        done()
                    })

            })

        })


        describe('查询一条记录的详情,验证是否包含关注关系', function () {
            it('应返回详情', function (done) {
                request.get(`/user/${test_users[0].id}`)
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.name.should.equal(test_users[0].name)
                        res.body.data.follows.length.should.equal(1)
                        done()
                    })

            })
        })

        describe('查询一位用户周围的人', function () {
            it('9米以内', function (done) {
                request.get(`/user/neighbouring/${test_users[6].id}/9`)
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.list.length.should.equal(1, '9米以内应该只有当前用户自己')
                        done()
                    })

            })
            it('900米以内', function (done) {
                request.get(`/user/neighbouring/${test_users[6].id}/900`)
                    .expect(200)
                    .end((err, res) => {
                        assert(!err)
                        res.body.code.should.equal(0)
                        res.body.data.list.length.should.equal(6, '900米以内应该有6个人(包括自己)')
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
        UserFollow.destroy({
            where:
                {
                    deletedAt: { [BaseRepository.Op.not]: null }
                }, force: true
        })
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





