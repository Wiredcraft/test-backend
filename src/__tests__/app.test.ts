import supertest from 'supertest';
import { app } from '../app';


describe('GET /ping', () => {
  const server = app.callback();
  const request: supertest.SuperTest<supertest.Test> = supertest(server);

  it('should return OK', async () => {
    const res = await request.get('/ping')
      .expect(200)

    expect(res.body.status).toBe('OK');
  });
});

describe('GET a non existing path', () => {
  const server = app.callback();
  const request: supertest.SuperTest<supertest.Test> = supertest(server);

  it('should return a 404 error', async () => {
    const res = await request.get('/IDONOTEXISTS').expect(404);

    expect(res.body).toMatchSnapshot();
  });
});
