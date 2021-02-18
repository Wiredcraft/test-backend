const server = require('./server')

const userName = `u${Date.now()}`
const password = `p${Date.now()}`
const testUser = {
    name: userName,
    password,
    address: "1234 Main St",
    description: "test description"
}

let COOKIE = ''

// init sign up
test('user creation', async () => {
    const res = await server
        .post('/users')
        .send(testUser)
    expect(res.body.errCode).toBe(-1)
})

// sign up with same user name
test('duplicate user creation', async () => {
    const res = await server
        .post('/users')
        .send(testUser)
    expect(res.body.errCode).not.toBe(-1)
})


test('look up user name', async () => {
    const res = await server
        .get(`/users/${userName}`)
    expect(res.body.errCode).toBe(-1)
})

// json schema check
test('login json validates', async () => {
    const res = await server
        .post('/user')
        .send({
            userName: '123', // username contains unexpected combinations
            password: 'a', // min length violation
        })
    expect(res.body.errCode).not.toBe(-1)
})

//login
test('user login', async () => {
    const res = await server
        .post('/users/login')
        .send({
            username: userName,
            password
        })
    expect(res.body.errCode).toBe(-1)

    // get cookie
    COOKIE = res.headers['set-cookie'].join(';')
})

// update info
test('update info', async () => {
    const res = await server
        .patch('/users/info')
        .send({
          name: userName,
          description: "updated description"
        })
        .set('cookie', COOKIE)
    expect(res.body.errCode).toBe(-1)
})

// update pwd
test('update password', async () => {
    const res = await server
        .patch('/users/password')
        .send({
            name: userName,
            password,
            newPassword: `p_${Date.now()}`
        })
        .set('cookie', COOKIE)
    expect(res.body.errCode).toBe(-1)
})

// delete
test('delete user', async () => {
    const res = await server
        .post('/users/delete')
        .send({
          username: userName,
          isSoft: true
        })
        .set('cookie', COOKIE)
    expect(res.body.errCode).toBe(-1)
})

// loggout
test('user logout', async () => {
    const res = await server
        .post('/users/logout')
        .set('cookie', COOKIE)
    expect(res.body.errCode).toBe(-1)
})

// lookup after deletion
test('look up user after deleted', async () => {
    const res = await server
        .post(`/users/${userName}`)
    expect(res.body.errCode).not.toBe(-1)
})
