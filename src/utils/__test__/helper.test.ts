import should from 'should'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { timeFormat, sleep, dataFormat } from '../helper'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

describe('helper', () => {
    describe.skip('timeFormat', () => {
        it('返回 2019-12-26 16:49:53', () => {
            const date = '2019-12-26T08:49:53.325Z'
            timeFormat(date).should.be.equal('2019-12-26 16:49:53')
        })
    })
    describe.skip('sleep', () => {
        it('延时 1000 毫秒', done => {
            const start = Date.now()
            const time = 1000
            sleep(time).then(() => {
                const end = Date.now()
                should(end - start >= time).be.ok()
                done()
            })
        })
    })
    describe('dataFormat', () => {
        it('返回 1023.00 B', () => {
            dataFormat(1023).should.equal('1023.00 B')
        })
        it('返回 1023.00 GB', () => {
            dataFormat(1023 * 1024 * 1024 * 1024).should.equal('1023.00 GB')
        })
    })
})