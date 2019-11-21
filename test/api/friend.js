const assert = require('assert');
const supertest = require('supertest');
const sinon = require('sinon');
const app = require('../../server/app');
const User = require('../../server/models/user');
const Friend = require('../../server/models/friend');
const util = require('../util');

const agent = supertest.agent(app);

describe('Friend api: api/friend.js', () => {
  const headers = {};
  let owner = {};
  let users = [
    {
      isAdmin: false,
      address: 'earth',
      description: 'I am one punch man',
      name: 'tester-xxx1',
      password: 'somepassword',
      salt: 'xsalt',
      dob: new Date('2019-11-15T00:00:00.000Z'),
      location: [
        108.0221,
        24.74928
      ]
    },
    {
      isAdmin: false,
      address: 'earth',
      description: 'I am one punch man',
      name: 'tester-xxx2',
      password: 'somepassword',
      salt: 'xsalt',
      dob: new Date('2019-11-15T00:00:00.000Z'),
      location : [ 
          108.0222, 
          24.74929
      ]
    },
  ];
  before(async function() {
    users = await User.insertMany(users);
    owner = users[0];
    const token = util.getToken(owner);
    headers['Authorization'] = 'Bearer ' + token;
  });

  after(async function() {
    const names = users.map(item => item.name);
    await User.deleteMany({ name: { $in: names } });
    await Friend.deleteMany({ userId: owner._id });
  });

  it('should add friend by user', function(done) {
    agent
      .set(headers)
      .post('/friends')
      .type('json')
      .query({ meter: 1000, limit: 10 })
      .send({ friendIds: [users[1]._id] })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.equal(res.body.code, 0);
        done();
      });
  });
  it('should response user friends success', function(done) {
    const limit = 10;
    const meter = 1000;
    agent
      .set(headers)
      .get('/friends/' + users[1].name)
      .query({ meter, limit })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.equal(res.body.code, 0);
        const data = res.body.data;
        assert.ok(data.user);
        assert.ok(data.friends);
        assert.equal(data.limit, limit)
        assert.equal(data.meter, meter);
        assert.ok(data.friends.length === 0);
        done();
      });
  });
  it('should response user friends success but empty friends', function(done) {
    const limit = 10;
    const meter = 1000;
    agent
      .set(headers)
      .get('/friends/' + owner.name)
      .query({ meter, limit })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.equal(res.body.code, 0);
        const data = res.body.data;
        assert.ok(data.user);
        assert.ok(data.friends);
        assert.equal(data.limit, limit)
        assert.equal(data.meter, meter);
        assert.ok(data.friends.length > 0);
        done();
      });
  });
});