import should from 'should'
import { md5, sha256, sha512 } from '../encrypt'
describe('encrypt', () => {
    describe('md5', () => {
        it('md5("123456")', () => {
            should(md5('123456')).equal('e10adc3949ba59abbe56e057f20f883e')
        })
    })
    describe('sha256', () => {
        it('sha256("123456")', () => {
            sha256('123456').should.equal('8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92')
        })
    })
    describe('sha512', () => {
        it('sha512("123456")', () => {
            sha512('123456').should.equal('ba3253876aed6bc22d4a6ff53d8406c6ad864195ed144ab5c87621b6c233b548baeae6956df346ec8c17f5ea10f35ee3cbc514797ed7ddd3145464e2a0bab413')
        })
    })
})