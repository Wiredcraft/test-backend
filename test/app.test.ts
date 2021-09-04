import http = require('http')
import request = require('supertest')
import should from 'should'
import { app } from '../src/app'
import { PORT } from '../src/config'
let server: http.Server
describe('app e2e测试', () => {
    before(done => {
        server = app.listen(PORT, () => {
            console.log(`测试服务器已启动：http://127.0.0.1:${PORT}`)
            done()
        })
    })
    after(done => {
        server.close(done)
    })
    it('状态路由，应该成功返回当前状态', done => {
        request(server).get('/status').expect(200, (err, res) => {
            if (err) {
                done(err)
                return
            }
            should(res.status === 200).ok()
            done()
        })
    })
    it('应该成功捕捉到 400 HttpError ', done => {
        request(server).get('/test/?status=400&httpError=true').expect(400, done)
    })
    it('应该成功捕捉到 Error ', done => {
        request(server).get('/test/?error=true').expect(500, done)
    })
})