import request from 'supertest'
import { testServer } from '../utils/connect'

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
            .end(done)
    })
})
