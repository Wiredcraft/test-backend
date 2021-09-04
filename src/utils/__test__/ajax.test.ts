import should from 'should'
import { ajax } from '../ajax'
describe('ajax', () => {
    describe('ajax', () => {
        it.skip('访问百度测试网络连通性', done => {
            ajax({ url: 'https://www.baidu.com/' }).then(res => {
                done()
            }).catch(e => {
                done(e)
            })
        })
    })
})