import test from 'ava'
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:4060/',
  timeout: 1000
})

test('Server is On', async t => {
  const res = await request.get('/')
  t.is(res.status, 200, 'server is not runing')
})

test('Create User should be success', async t => {
  const testUser = {
    name: 'testUser',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const res = await request.post('/api/users', testUser)
  t.is(res.status, 200, 'create user failed')
})

test.serial('Get User should be success', async t => {
  t.plan(6)

  const testUser = {
    name: 'testUser',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const createRes = await request.post('/api/users', testUser)
  t.is(createRes.status, 200, 'create user failed')

  const getRes = await request.get(`/api/users/${createRes.data.id}`)
  t.is(getRes.status, 200, 'get user failed')
  t.is(getRes.data.name, testUser.name, 'get user name incorrect')
  // TODO: valudate ISO-8601 date
  // t.is(getRes.data.dob, new Date(testUser.dob), 'get user dob incorrect')
  t.is(getRes.data.address, testUser.address, 'get user address incorrect')
  t.is(getRes.data.description, testUser.description, 'get user description incorrect')
  t.truthy(getRes.data.created_at, 'no created time generated')
})

test.serial('Update User should be success', async t => {
  t.plan(8)

  const testUser = {
    name: 'testUser',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const testUpdatedUser = {
    name: 'testUpdatedUser',
    dob: new Date('1988-10-10'),
    address: 'pudong, Shanghai, Shanghai',
    description: 'Frontend Developer'
  }

  const createRes = await request.post('/api/users', testUser)
  t.is(createRes.status, 200, 'create user failed')

  const updateRes = await request.put(`/api/users/${createRes.data.id}`, testUpdatedUser)
  t.is(updateRes.status, 200, 'update user failed')

  const getRes = await request.get(`/api/users/${createRes.data.id}`)
  t.is(getRes.status, 200, 'get user failed')
  t.is(getRes.data.name, testUpdatedUser.name, 'get user name incorrect')
  // TODO: valudate ISO-8601 date
  // t.is(getRes.data.dob, new Date(testUpdatedUser.dob), 'get user dob incorrect')
  t.is(getRes.data.address, testUpdatedUser.address, 'get user address incorrect')
  t.is(getRes.data.description, testUpdatedUser.description, 'get user description incorrect')
  t.truthy(getRes.data.created_at, 'no created time generated')
  t.truthy(getRes.data.modified_at, 'no modified time generated')
})

test.serial('Delete User should be success', async t => {
  t.plan(2)

  const testUser = {
    name: 'testUser',
    dob: new Date('1988-10-10'),
    address: 'xuhui, Shanghai, Shanghai',
    description: 'Backend Developer'
  }

  const createRes = await request.post('/api/users', testUser)
  t.is(createRes.status, 200, 'create user failed')

  const getRes = await request.delete(`/api/users/${createRes.data.id}`)
  t.is(getRes.status, 200, 'delete user failed')
})
