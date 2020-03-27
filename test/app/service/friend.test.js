'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/friend.test.js', () => {
  let firstNewUser;
  let secondNewUser;
  beforeEach(async () => {
    const ctx = app.mockContext({});
    [ firstNewUser, secondNewUser ] = (await ctx.model.User.create([{
      name: 'everybody knows', // user name
      avatar: 'https://lh3.googleusercontent.com/a-/AOh14Ggql38qroReOlg40DdKxbuLQY696-hudg9RRjK3',
      dob: new Date(), // date of birth
      address: 'hangzhou.zhejiang', // user address
      description: 'I\'m a test man no.1.', // user description
      location: {
        type: 'Point',
        coordinates: [ '27.68', '40.32' ], // mock
      },
    },
    {
      name: 'no one', // user name
      avatar: 'https://lh3.googleusercontent.com/a-/AOh14Ggql38qroReOlg40DdKxbuLQY696-hudg9RRjK3',
      dob: new Date(), // date of birth
      address: 'hangzhou.zhejiang', // user address
      description: 'I\'m a test man no.2.', // user description
      location: {
        type: 'Point',
        coordinates: [ '27.68', '41.32' ], // mock
      },
    },
    ]));
    return;
  });
  afterEach(async () => {
    const ctx = app.mockContext({});
    await Promise.all([
      ctx.model.User.deleteOne({ _id: firstNewUser._id }),
      ctx.model.User.deleteOne({ _id: secondNewUser._id }),
      ctx.model.Following.deleteOne({ userId: firstNewUser._id }),
      ctx.model.Following.deleteOne({ userId: secondNewUser._id }),
      ctx.model.Follower.deleteOne({ userId: firstNewUser._id }),
      ctx.model.Follower.deleteOne({ userId: secondNewUser._id }),
      ctx.model.FollowCount.deleteOne({ userId: firstNewUser._id }),
      ctx.model.FollowCount.deleteOne({ userId: secondNewUser._id }),
    ]);
    return;
  });
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should firstNewUser follow secondNewUser', async () => {
    const ctx = app.mockContext({});
    const result = await ctx.service.friend.follow({
      userId: firstNewUser._id,
      target: secondNewUser._id,
    });
    assert(result === true);
  });

  it('should firstNewUser unfollow secondNewUser', async () => {
    const ctx = app.mockContext({});
    await ctx.service.friend.follow({
      userId: firstNewUser._id,
      target: secondNewUser._id,
    });
    const result = await ctx.service.friend.unfollow({
      userId: firstNewUser._id,
      target: secondNewUser._id,
    });
    assert(result === true);
  });

  it('should get followings', async () => {
    const ctx = app.mockContext({});
    await Promise.all([ ctx.service.friend.follow({
      userId: firstNewUser._id,
      target: secondNewUser._id,
    }), ctx.service.friend.follow({
      userId: secondNewUser._id,
      target: firstNewUser._id,
    }) ]);

    const result = await ctx.service.friend.getFollowings({
      userId: firstNewUser._id,
      nextId: secondNewUser._id,
      limit: 20,
    });

    await Promise.all([ ctx.service.friend.unfollow({
      userId: firstNewUser._id,
      target: secondNewUser._id,
    }), ctx.service.friend.unfollow({
      userId: secondNewUser._id,
      target: firstNewUser._id,
    }) ]);
    assert(result.result.length === 1);
  });
});
