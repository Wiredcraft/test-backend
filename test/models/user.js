const assert = require('assert');
const pwd = require('pwd');
const User = require('../../server/models/user');

const user = {
  address: 'earth',
  description: 'I am one punch man',
  name: 'tester-xxx' + Date.now(),
  password: 'password',
  salt: 'xsalt',
  dob: new Date('2019-11-15T00:00:00.000Z'),
  location: [
    108.0221,
    24.74928
  ]
};

describe('models/user.js', () => {
  describe('toobject', function() {
    after(async function() {
      await User.deleteOne({ 'name': user.name });
    });
    it('toObject and toJSON should without password and salt', async function() {
      const result = await User.create(user);
      assert.ok(result.password);
      assert.ok(result.salt);
      const record = result.toObject();
      assert.ok(!record.password);
      assert.ok(!record.salt);
      const userJson = result.toJSON();
      assert.ok(!userJson.password);
      assert.ok(!userJson.salt);
      await result.remove();
    });
  });
  it('should addUser encode password and salt', async function() {
    const userInfo = Object.assign({}, user);
    const originPassword = userInfo.password;
    userInfo.name = 'newname' + Date.now();
    const record = await User.addUser(userInfo);
    assert.ok(record.password);
    assert.ok(record.salt);
    assert.ok(record.password !== originPassword);
    const result = await pwd.hash(originPassword, record.salt);
    assert.equal(result.hash, record.password);
    await record.remove();
  });
 
});