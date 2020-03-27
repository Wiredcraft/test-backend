'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/users.test.js', () => {
  let newUser;
  beforeEach(async () => {
    const ctx = app.mockContext({});
    newUser = (await ctx.model.User.create([{
      name: 'everybody knows', // user name
      avatar: 'https://lh3.googleusercontent.com/a-/AOh14Ggql38qroReOlg40DdKxbuLQY696-hudg9RRjK3',
      dob: new Date(), // date of birth
      address: 'zhejiang.hangzhou', // user address
      description: 'I\'m a test man.', // user description
      location: {
        type: 'Point',
        coordinates: [ '27.68', '120.32' ], // mock
      },
    }]))[0];
  });
  afterEach(async () => {
    const ctx = app.mockContext({});
    await ctx.model.User.deleteOne({ _id: newUser._id });
  });
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /api/v1/users?mode=page', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/users?mode=page')
      .expect(200);
    assert(result.body.message === 'ok');
    assert(result.body.data.list.length > 0);
  });

  it('should GET /api/v1/users?mode=skip', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/users?mode=page')
      .expect(200);

    assert(result.body.message === 'ok');
    assert(result.body.data.list.length > 0);
  });
});
