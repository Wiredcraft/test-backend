const { assert } = require('chai');
const _ = require('lodash');
const Helper = require('./helper');
const { users: userModel } = require('../model');

describe('get users', () => {
  describe('success request', () => {
    let response;
    let userInfo;
    let userId;

    before('insert data into db', async () => {
      userInfo = {
        name: 'Wiredcraft',
        dob: '1994-10-31',
        address: 'China',
        description: 'hello world'
      };
      ({ userId } = await userModel.insertUser(userInfo));
    })

    before('mock api', async () => {
      response = await Helper.getUser({ userId });
    });

    it('should have correct response format', () => {
      assert.isNotNull(response);
      assert.nestedPropertyVal(response, 'status', 200);
      assert.nestedPropertyVal(response, 'data.errorCode', 0);
      assert.nestedProperty(response, 'data.data');
    });

    it('should have correct properties in reponse', () => {
      const data = _.get(response, 'data.data');
      assert.nestedPropertyVal(data, 'name', userInfo.name);
      assert.nestedPropertyVal(data, 'dob', userInfo.dob);
      assert.nestedPropertyVal(data, 'address', userInfo.address);
      assert.nestedPropertyVal(data, 'description', userInfo.description);
    });
  });

  // TODO, more exception test cases
  describe('userId does not exist', () => {
    let response;

    before('mock api', async () => {
      response = await Helper.getUser({
        userId: Helper.generateObjectIdToString()
      });
    });

    it('should have correct response format', () => {
      assert.isNotNull(response);
      assert.nestedPropertyVal(response, 'status', 200);
      assert.nestedPropertyVal(response, 'data.errorCode', 0);
      const data = _.get(response, 'data.data');
      assert.isObject(data);
      assert.strictEqual(Object.keys(data).length, 0);
    });
  });
});
