import request from 'supertest'
import { server, prisma } from '../server'


afterAll(async () => {
    await prisma.$disconnect()
})


const user = {
    name: "Maxson Almeida",
    dob: "1994-10-14",
    address: "Rua dos Comerciarios, Numero 3 ",
    description: "É UM DESENVOLVER BACKEND",
}

test('Create user', async () => {
    const response = await request(server)
        .post('/users')
        .send(user)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)

    expect(response.body.id).toBeDefined()
})

test('Get user', async () => {
    const response = await request(server).get('/users')
    expect(response.status).toEqual(200)
    expect(response.body.length).toBeGreaterThan(0)
})

test('Get user by id', async () => {
    const response = await request(server)
        .get('/users/f3c931ca-0e5d-42c3-9e77-6325595e0592')
        .expect("Content-Type", /json/)
        .expect(200)


    expect(response.body.id).toBeDefined()
})