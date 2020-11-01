import request from 'supertest'
import { testServer } from '../utils/connect'

describe('Testing public routes', () => {
    it('should get home page', (done) => {
        request(testServer)
            .get('/')
            .expect(200)
            .end(done)
    })
})
