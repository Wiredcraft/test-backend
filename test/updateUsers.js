const { assert } = require('chai');
const _ = require('lodash');
const Helper = require('./helper');
const { users: userModel } = require('../model');

describe('update users', () => {
  describe('success request', () => {
    let response;
    let userInfo;
    let userId;
    let dbResult;

    before('insert data into db', async () => {
      const oldUserInfo = {
        name: 'Wiredcraft',
        dob: '1994-10-31',
        address: 'China',
        description: 'hello world'
      };
      ({ userId } = await userModel.insertUser(oldUserInfo));
    });

    before('mock api', async () => {
      userInfo = {
        name: 'NewWiredcraft',
        dob: '1994-10-31',
        address: 'China',
        description: 'new hello world'
      };
      response = await Helper.updateUser(userId, userInfo);
    });

    before('find data in db', async () => {
      dbResult = await userModel.findUserByUserId(userId);
    });

    it('should have correct response format', () => {
      assert.isNotNull(response);
      assert.nestedPropertyVal(response, 'status', 200);
      assert.nestedPropertyVal(response, 'data.errorCode', 0);
      assert.nestedProperty(response, 'data.data');
      assert.nestedPropertyVal(response, 'data.data.affectRowsCount', 1);
    });

    it('should have correct properties in reponse', () => {
      assert.nestedPropertyVal(dbResult, 'name', userInfo.name);
      assert.nestedPropertyVal(dbResult, 'dob', userInfo.dob);
      assert.nestedPropertyVal(dbResult, 'address', userInfo.address);
      assert.nestedPropertyVal(dbResult, 'description', userInfo.description);
    });
  });

  // TODO, more exception test cases
  describe('userId does not exist', () => {
    let response;
    let dbResult;
    let userId;

    before('mock api', async () => {
      userId = Helper.generateObjectIdToString();
      response = await Helper.updateUser(userId, {
        name: 'NewWiredcraft',
        dob: '1994-10-31',
        address: 'China',
        description: 'new hello world'
      });
    });

    before('find data in db', async () => {
      dbResult = await userModel.findUserByUserId(userId);
    })

    it('should have correct response format', () => {
      assert.isNotNull(response);
      assert.nestedPropertyVal(response, 'status', 200);
      assert.nestedPropertyVal(response, 'data.errorCode', 0);
      const data = _.get(response, 'data.data');
      assert.isObject(data);
      assert.nestedPropertyVal(data, 'affectRowsCount', 0);
    });

    it('should have correct db result', async () => {
      assert.isNull(dbResult);
    });
  });
});
