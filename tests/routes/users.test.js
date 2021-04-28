const app = require('../../src/index'); // link to the server file
const supertest = require('supertest');
const request = supertest(app);

const mongoose = require('mongoose');
const User = require('../../src/models/user');

const config = require('../../src/configs/config');

const { db: { host, port, name } } = config;
const connectionString = `mongodb://${host}:${port}/${name}`;

beforeAll(async () => {
    // disconnect mongoose from the db of app instance
    await mongoose.disconnect();
    await mongoose.connect(connectionString, {
        useNewUrlParser: true
    });

    const presetUsers = [{
            _id: '6088d0ccf5a4bb73ed24cf1f',
            name: 'Julia Shaam',
            dob: '1985-09-01',
            address: '349 Cyder Street',
            description: 'My dad is British.'
        },
        {
            _id: '6088d0ccf5a4bb73ed24cf2f',
            name: 'Brandy King',
            dob: '1988-10-20',
            address: '19 Rother Street',
            description: 'I have ginger hair.'
        },
        {
            _id: '6088d0ccf5a4bb73ed24cf3f',
            name: 'Marcelo Saciloto',
            dob: '1988-07-01',
            address: '73 Maple Street',
            description: 'I am a Brazilian papa.'
        }
    ]
    for (const u of presetUsers) {
        const user = new User(u);
        await user.save();
    }
})


afterAll(async () => {
    // clean up DB.
    await User.deleteMany();
    // closing the DB connection allows Jest to exit successfully
    await mongoose.disconnect();
    await app.close();
})

describe('Test /users endpoint functions', () => {
    it('Should get all users', async done => {
        const response = await request
            .get('/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(3);
        done();
    })

    it('Should save user to database', async done => {
        const data = {
            name: 'John Doe',
            dob: '1900-01-01',
            address: 'Up in heaven',
            description: 'I do not exist'
        };
        const response = await request
            .post('/users')
            .send(data);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(data.name);

        // clean up DB
        await User.findOneAndDelete({}, {
            sort: {
                createdAt: -1
            }
        })
        done();
    })

    it('Should return 403 when dob is invalid', async done => {
        const data = {
            name: 'John Doe',
            dob: '1900-01-1000',
            address: 'Up in heaven',
            description: 'I do not exist'
        };
        const response = await request
            .post('/users')
            .send(data);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Invalid parameters.');

        done();
    })

    it('Should return 403 when required fields are not fulfilled', async done => {
        const data = {
            name: 'John Doe',
            dob: '1900-01-10',
            description: 'I do not exist'
        };
        const response = await request
            .post('/users')
            .send(data);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Invalid parameters.');

        done();
    })

    it('Should find the user by ID', async done => {
        const response = await request
            .get('/users/6088d0ccf5a4bb73ed24cf3f');

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Marcelo Saciloto');

        done();
    })

    it('Should return 404 when user does not exist', async done => {
        const response = await request
            .get('/users/6088d0ccf5a4bb73ed24cfee');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No valid entry found for provided ID.');

        done();
    })

    it('Should update user by ID', async done => {
        const data = {
            name: 'Juan Mendosa',
            description: 'I am the king of narcos.'
        }

        const response = await request
            .patch('/users/6088d0ccf5a4bb73ed24cf3f')
            .send(data);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(data.name);
        expect(response.body.description).toBe(data.description);

        done();
    })

    it('Should delete user by ID', async done => {
        const response = await request
            .delete('/users/6088d0ccf5a4bb73ed24cf1f');

        expect(response.statusCode).toBe(204);

        done();
    })

    it('Should return 404 when trying to delete a nonexistent user', async done => {
        const response = await request
            .delete('/users/6088d0ccf5a4bb73ed24cfee');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('User not found.');

        done();
    })

    it('Should return 500 when trying to delete user by invalid ID', async done => {
        const response = await request
            .delete('/users/6088d0ccf5a4bb73ed24cf1');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Internal error.');

        done();
    })
});