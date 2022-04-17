"use strict";

const expect = require("chai").expect;
const app = require("../server/server.js");
const moment = require("moment");
const userService = require("../common/services/user.service.js");

describe("Unit tests for delete user by id.", function () {
  this.timeout(10000);
  const testName = "Anna King";
  const testDob = "1993-12-16";
  const testAddr = "Nanjing road 123, Shanghai, China";
  const testDesc = "test data 1";
  const testCreatedAt = "2022-4-16";
  let testId = "";
  before(async function () {
    //load test data
    let newOne = await app.models.user.create({
      name: testName,
      dob: testDob,
      address: testAddr,
      description: testDesc,
      createdAt: testCreatedAt,
    });
    testId = newOne.id;
  });

  it("delete user by id.", async function () {
    try {
      const result = await userService.deleteById(testId);
      expect(result.count).to.be.equal(1);
    } catch (error) {
      console.error(error);
      console.error("failed create new user unit test.");
    }
  });
});
