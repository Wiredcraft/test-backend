import should from 'should'
import { isURL, isBittorrent } from '../regexp'
describe('regexp', () => {
    describe('isURL', () => {
        it('https://www.baidu.com 返回 true', () => {
            should(isURL('https://www.baidu.com')).ok()
        })
        it('http://www.baidu.com 返回 true', () => {
            should(isURL('http://www.baidu.com')).ok()
        })
        it('https://www.baidu.com/123 返回 true', () => {
            should(isURL('https://www.baidu.com/123')).ok()
        })
        it('https://www.baidu.com/123?q=123 返回 true', () => {
            should(isURL('https://www.baidu.com/123?q=123')).ok()
        })
        it('https://baidu.com 返回 true', () => {
            should(isURL('https://baidu.com')).ok()
        })
        it('baidu.com 返回 true', () => {
            should(isURL('baidu.com')).ok()
        })
        it('www.baidu.com 返回 true', () => {
            should(isURL('www.baidu.com')).ok()
        })
    })
    describe('isBittorrent', () => {
        it('hash 不足32位', () => {
            should(isBittorrent('magnet:?xt=urn:btih:QSBZA65STRE6QTU6KBVSTH33TF2NZRN')).not.ok()
        })
        it('hash 足32位', () => {
            should(isBittorrent('magnet:?xt=urn:btih:QSBZA65STRE6QTU6KBVSTH33TF2NZRND')).ok()
        })
        it('末尾带链接', () => {
            should(isBittorrent('magnet:?xt=urn:btih:QSBZA65STRE6QTU6KBVSTH33TF2NZRND&tr=http://d-shiro.yuuki-chan.xyz:6881/announce&tr=http://open.nyaatorrents.info:6544/announce&tr=udp://tracker.openbittorrent.com:80/announce')).ok()
        })
    })
})