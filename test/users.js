import test from 'ava'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:6060/'
const request = axios.create({
  baseURL: baseURL,
  timeout: 1000
})

test('Server State', async t => {
  const res = await request.get('/')
  t.is(res.status, 200, 'Server state is incorrect')
})

test('Create Users', async t => {
  const testUser = {
    user_name: 'test_user_create',
    password: 'password_create',
    name: 'testUser_create',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const res = await request.post('/api/users', testUser)
  t.is(res.status, 200, 'Create user failed')
})

test.serial('Get User by id', async t => {
  t.plan(7)
  const testUser = {
    user_name: 'test_user_get',
    password: 'password_get',
    name: 'testUser_get',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }
  const res = await request.post('/api/users', testUser)
  const createdUser = res.data
  t.is(res.status, 200, 'create user failed')

  const getRes = await request.get(`/api/users/${createdUser.id}`)

  t.is(getRes.status, 200, 'Get user failed')
  t.is(getRes.data.name, testUser.name, 'Get user\'s name incorrect')
  t.is(getRes.data.dob, testUser.dob.toISOString(), 'Get user dob incorrect')
  t.is(getRes.data.address, testUser.address, 'Get user\'s address incorrect')
  t.is(getRes.data.description, testUser.description, 'Get user\'s description incorrect')
  t.truthy(getRes.data.created_at, 'User created time missing')
})

test.serial('Update User by id', async t => {
  t.plan(15)

  const testUser = {
    user_name: 'test_user_update',
    password: 'password_update',
    name: 'testUser_update',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const anotherUser = {
    user_name: 'another_user_update',
    password: 'password_update',
    name: 'anotherUser_update',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const [testUserCreateRes, anotherUserCreateRes] = await Promise.all([
    request.post('/api/users', testUser),
    request.post('/api/users', anotherUser)
  ])
  t.is(testUserCreateRes.status, 200, 'Create user failed')
  t.is(anotherUserCreateRes.status, 200, 'Create user failed')

  const testUpdatedUser = {
    user_name: 'test_user_updated',
    password: 'password_updated',
    name: 'testUpdatedUser_updated',
    dob: new Date('1988-10-12'),
    address: 'pudong, Shanghai, Shanghai',
    description: 'Frontend Developer'
  }

  let faileUpdateRes = null
  await request.put(`/api/users/${testUserCreateRes.data.id}`, testUpdatedUser)
    .catch(err => {
      faileUpdateRes = err.response
    })
  t.is(faileUpdateRes.status, 401, 'Update user not failed without login')

  const loginInfo = {
    user_name: testUser.user_name,
    password: testUser.password
  }
  const loginRes = await request.post('/api/users/login', loginInfo)
  t.is(loginRes.status, 200, 'Login failed with correct info')
  t.truthy(loginRes.data.id, 'Not receive access token after login')

  request.defaults.headers.common['Authorization'] = loginRes.data.id
  const updateSelfRes = await request.put(`/api/users/${testUserCreateRes.data.id}`, testUpdatedUser)
  t.is(updateSelfRes.status, 200, 'Update self failed')
  t.is(updateSelfRes.data.user_name, testUser.user_name, 'User name has been changed')
  t.falsy(updateSelfRes.data.password, 'Password not hidden from user')
  t.is(updateSelfRes.data.name, testUpdatedUser.name, 'Update self name incorrect')
  t.is(updateSelfRes.data.dob, testUpdatedUser.dob.toISOString(), 'Get user dob incorrect')
  t.is(updateSelfRes.data.address, testUpdatedUser.address, 'Update self address incorrect')
  t.is(updateSelfRes.data.description, testUpdatedUser.description, 'Update self description incorrect')
  t.truthy(updateSelfRes.data.created_at, 'No created time')
  t.truthy(updateSelfRes.data.modified_at, 'No modified time')

  let updateOtherRes = null
  await request.put(`/api/users/${anotherUserCreateRes.data.id}`, testUpdatedUser)
    .catch(err => {
      updateOtherRes = err.response
    })
  t.is(updateOtherRes.status, 403, 'Updated other user than self')
})

test.serial('Delete User by id', async t => {
  t.plan(2)

  const testUser = {
    user_name: 'test_user_del',
    password: 'password_del',
    name: 'testUser_del',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const createRes = await request.post('/api/users', testUser)
  t.is(createRes.status, 200, 'Create user failed')

  const getRes = await request.delete(`/api/users/${createRes.data.id}`)
  t.is(getRes.status, 200, 'Delete user failed')
})
