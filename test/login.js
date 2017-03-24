import test from 'ava'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:6060/'
const request = axios.create({
  baseURL: baseURL,
  timeout: 1000
})

test('User Login & Logout', async t => {
  t.plan(5)
  const testUser = {
    user_name: 'test_user_login',
    password: 'password_login',
    name: 'testUser_login',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const createRes = await request.post('/api/users', testUser)
  t.is(createRes.status, 200, 'Create user failed')

  const failLoginInfo = {
    user_name: 'not_exist',
    password: 'not_exist'
  }

  let failLoginRes = null
  await request.post('/api/users/login', failLoginInfo)
    .catch(err => {
      failLoginRes = err.response
    })
  t.is(failLoginRes.status, 412, 'Login not failed with wrong info')

  const successLoginInfo = {
    user_name: testUser.user_name,
    password: testUser.password
  }
  const successLoginRes = await request.post('/api/users/login', successLoginInfo)
  t.is(successLoginRes.status, 200, 'Login failed with correct info')
  t.truthy(successLoginRes.data.id, 'Not receive access token after login')

  request.defaults.headers.common['Authorization'] = successLoginRes.data.id
  const logoutRes = await request.post('/api/users/logout')
  t.is(logoutRes.status, 204, 'Logout failed with correct info')
})
