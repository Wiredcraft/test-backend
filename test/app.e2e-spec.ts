import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();


    });

    afterAll(async () => {
        mongoose.disconnect();
    });

    it('/users (POST)', done => {
        return request(app.getHttpServer())
            .post('/users')
            .send({name: 'yarco-e2e-001', dob: '2019-01-01', address: '', description: '', createdAt: Date.now()})
            .expect(201)
            .end(done)
        ;
    });

    it('/users/:id (GET)', done => {
        return request(app.getHttpServer())
            .get('/users/5dfade7b154b57225edd690e')
            .expect(200)
            .end(done)
        ;
    });

    it('/users/:id (PUT)', done => {
        return request(app.getHttpServer())
            .put('/users/5dfade7b154b57225edd690e')
            .send({name: 'yarco-e2e-002'})
            .expect(200)
            .end(done)
        ;
    });

    it('/users/:id (DELETE)', done => {
        return request(app.getHttpServer())
            .del('/users/5dfade7b154b57225edd690e')
            .expect(200)
            .end(done)
        ;
    });
});
