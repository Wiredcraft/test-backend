"use strict";

const expect = require("chai").expect;
const app = require("../server/server.js");
const moment = require("moment");
const userService = require("../common/services/user.service.js");

describe("Unit tests for user: find all, find by id.", function () {
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

  it("find all user.", async function () {
    try {
      const result = await userService.getAll();

      expect(result).to.have.property("size");
      expect(result).to.have.property("data");
      expect(result.size).to.be.gte(1);
      let userNameList = [];
      for (let user of result.data) {
        expect(user).to.have.property("id");
        expect(user).to.have.property("name");
        expect(user).to.have.property("dob");
        expect(user).to.have.property("address");
        userNameList.push(user.name);
      }
      expect(userNameList.includes(testName)).to.be.true;
    } catch (error) {
      console.error(error);
      console.error("failed find all user unit test.");
    }
  });

  it(`find user by id.`, async function () {
    const result = await userService.getById(testId);
    expect(result).to.have.property("id");
    expect(result).to.have.property("name");
    expect(result).to.have.property("dob");
    expect(result).to.have.property("address");
    expect(result).to.have.property("description");
    expect(result.name).to.be.equal(testName);
    const checkDob = moment(result.dob).isSame(testDob, "day");
    expect(checkDob).to.be.true;
    expect(result.address).to.be.equal(testAddr);
    expect(result.description).to.be.equal(testDesc);
  });

  it(`find user by id: non existed id.`, async function () {
    const nonexistedId = "123456789000";
    const msg = "Not Found";
    const result = await userService.getById(nonexistedId);
    expect(result.statusCode).to.be.equal(404);
    expect(result.message).to.be.equal(msg);
  });

  after(async function () {
    await app.models.user.deleteById(testId);
  });
});
