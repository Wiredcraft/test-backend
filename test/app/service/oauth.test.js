'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/oauth.test.js', () => {
  let newUser;
  after(async () => {
    const ctx = app.mockContext({});
    return await Promise.all([
      ctx.model.User.deleteOne({ _id: newUser._id }),
      ctx.model.Authorization.deleteOne({ userId: newUser._id }),
    ]);
  });
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should register a user', async () => {
    const ctx = app.mockContext({});
    const _displayName = 'everybody knows';
    const _newUser = await ctx.service.oauth.register({
      displayName: _displayName,
      photo: 'https://lh3.googleusercontent.com/a-/AOh14Ggql38qroReOlg40DdKxbuLQY696-hudg9RRjK3',
    });
    newUser = _newUser;
    assert(_newUser.name === _displayName);
  });

});
