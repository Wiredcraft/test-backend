'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/user.test.js', () => {
  let newUser;
  before(async () => {
    const ctx = app.mockContext({});
    newUser = (await ctx.model.User.create([{
      name: 'everybody knows', // user name
      avatar: 'https://lh3.googleusercontent.com/a-/AOh14Ggql38qroReOlg40DdKxbuLQY696-hudg9RRjK3',
      dob: new Date(), // date of birth
      address: 'hangzhou.zhejiang', // user address
      description: 'I\'m a test man.', // user description
      location: {
        type: 'Point',
        coordinates: [ '27.68', '40.32' ], // mock
      },
    }]))[0];
    return;
  });
  after(async () => {
    const ctx = app.mockContext({});
    await ctx.model.User.deleteOne({ _id: newUser._id });
    return;
  });
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should get user list via page mode', async () => {
    const ctx = app.mockContext({});
    const result = await ctx.service.user.getUsersViaPageMode({
      page: 1,
      limit: 20,
    });
    assert(result.list.length > 0);
  });

  it('should get user list via skip mode', async () => {
    const ctx = app.mockContext({});
    const result = await ctx.service.user.getUsersViaPageMode({
      nextId: newUser._id.toString(),
      limit: 20,
    });
    assert(result.list.length > 0);
  });
});
