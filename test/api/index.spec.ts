import { expect, use } from 'chai'
import chaijsonSchema from 'chai-json-schema'
import request from 'supertest'
import { testServer } from '../utils/connect'

use(chaijsonSchema)

export const waiting = async function (seconds: number): Promise<number> {
    return new Promise(function (resolve) {
        return setTimeout(() => resolve(seconds), seconds * 1000)
    })
}

describe('Testing public routes', () => {
    it('should get home page', (done) => {
        request(testServer)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.text).equal('Hello Curious Person!')
                done()
            })
    })
})
