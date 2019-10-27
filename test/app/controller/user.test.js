const { app, mock, assert } = require('egg-mock/bootstrap')

function mockService (app) {
  app.mockService('user', 'findById', ({ id }) => {
    if (id === '5db257756790d522642a27f1') {
      return {
        code: 1,
        data: {
          basicInfo: {
            name: 'test_22',
            dob: '2010-08-01T00:00:00.000Z',
            address: 'shanghai',
            description: 'good'
          },
          valid: true,
          _id: '5db257756790d522642a27f1',
          following: [],
          followers: []
        }
      }
    } else {
      return {
        code: -1,
        data: {}
      }
    }
  })
}

describe('get user test', () => {
  before(() => mockService(app))

  it('get existed user', () => {
    return app
      .httpRequest()
      .get('/api/v1/user/5db257756790d522642a27f1')
      .expect(200)
      .expect({
        msg: 'success',
        code: 1,
        data: {
          basicInfo: { name: 'test_22', dob: '2010-08-01T00:00:00.000Z', address: 'shanghai', description: 'good' },
          valid: true,
          _id: '5db257756790d522642a27f1',
          following: [],
          followers: []
        }
      })
  })

  it('get non-existed user', () => {
    return app
      .httpRequest()
      .get('/api/v1/user/5db257756790d522642a27fc')
      .expect(200)
      .expect({
        msg: 'success',
        code: -1,
        data:null
      })
  })
})
