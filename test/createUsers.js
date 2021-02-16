const { assert } = require('chai');
const _ = require('lodash');
const Helper = require('./helper');
const { users: userModel } = require('../model');

describe('create user', () => {
  describe('success request', () => {
    let response;
    let userInfo;
    let dbResult;
    let userId;

    before('setUp info', () => {
      userInfo = {
        name: 'Wiredcraft',
        dob: '1994-10-31',
        address: 'China',
        description: 'hello world'
      }
    });

    before('mock api', async () => {
      response = await Helper.createUser(userInfo);
      userId = _.get(response, 'data.data.userId');
    });

    before('find collection', async () => {
      dbResult = await userModel.findUserByUserId(userId);
    });

    it('should have correct response format', () => {
      assert.isNotNull(response);
      assert.nestedPropertyVal(response, 'status', 200);
      assert.nestedPropertyVal(response, 'data.errorCode', 0);
      assert.nestedProperty(response, 'data.data');
      assert.nestedProperty(response, 'data.data.userId');
    });

    it('should have correct documents in DB', () => {
      assert.nestedPropertyVal(dbResult, 'name', userInfo.name);
      assert.nestedPropertyVal(dbResult, 'dob', userInfo.dob);
      assert.nestedPropertyVal(dbResult, 'address', userInfo.address);
      assert.nestedPropertyVal(dbResult, 'description', userInfo.description);
    });
  });

  // TODO, more error test cases
  describe('error request body', () => {
    let response;

    before('mock api', async () => {
      const errorUserInfo = {
        name1: 'Wiredcraft',
        dob: '1994-10-31',
        address: 'China',
      }
      response = await Helper.createUser(errorUserInfo);
    });

    it('should have correct response format', () => {
      assert.isNotNull(response);
      assert.nestedPropertyVal(response, 'status', 200);
      assert.nestedPropertyVal(response, 'data.errorCode', 1);
      assert.nestedProperty(response, 'data.message');
    });
  });
});
