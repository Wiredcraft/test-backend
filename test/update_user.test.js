"use strict";

const expect = require("chai").expect;
const app = require("../server/server.js");
const moment = require("moment");
const userService = require("../common/services/user.service.js");

describe("Unit tests for user: update by id.", function () {
  this.timeout(10000);
  const testName = "Anna King";
  const testDob = "1993-12-16";
  const testAddr = "Nanjing road 123, Shanghai, China";
  const testDesc = "test data 1";
  const testCreatedAt = "2022-4-16";

  const newName = "Alice Zhao";
  const newDob = new Date("1978-7-25");
  const newAddr = "Nanjing West Road 1038#, Jing'an District, Shanghai ";
  const newDesc = "test update user";

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

  it("01: update user by id, no input informaction except id.", async function () {
    const noInforChangedMsg = "No need to update DB.";
    try {
      const result = await userService.updateById(testId);
      expect(result.statusCode).to.be.equal(400);
      expect(result.message).to.be.equal(noInforChangedMsg);
    } catch (error) {
      console.error(error);
      console.error("failed update user 01 unit test.");
    }
  });

  it("02: update user by id, input empty informaction except id.", async function () {
    const noInforChangedMsg = "No need to update DB.";
    try {
      const result = await userService.updateById(testId, "  ", " ", "    ");
      expect(result.statusCode).to.be.equal(400);
      expect(result.message).to.be.equal(noInforChangedMsg);
    } catch (error) {
      console.error(error);
      console.error("failed update user 02 unit test.");
    }
  });

  it("03: update user by id, input empty informaction except id.", async function () {
    const noInforChangedMsg = "No need to update DB.";
    try {
      const result = await userService.updateById(testId, "     ");
      expect(result.statusCode).to.be.equal(400);
      expect(result.message).to.be.equal(noInforChangedMsg);
    } catch (error) {
      console.error(error);
      console.error("failed update user 03 unit test.");
    }
  });

  it("04: update user by id, input non existed id.", async function () {
    const nonexistedId = "123456789000";
    const noUserForIdMsg = `No user found for input id: ${nonexistedId}.`;
    try {
      const result = await userService.updateById(nonexistedId, "     ");
      console.log("04 result: ", JSON.stringify(result));
      expect(result.statusCode).to.be.equal(404);
      expect(result.message).to.be.equal(noUserForIdMsg);
    } catch (error) {
      console.error(error);
      console.error("failed update user 04 unit test.");
    }
  });

  it("05: update user by id successfully.", async function () {
    try {
      const result = await userService.updateById(
        testId,
        newName,
        newDob,
        newAddr,
        newDesc
      );
      expect(result).to.have.property("id");
      expect(result).to.have.property("name");
      expect(result).to.have.property("dob");
      expect(result).to.have.property("address");
      expect(result).to.have.property("description");
      expect(result.name).to.be.equal(newName);
      const checkDob = moment(result.dob).isSame(newDob, "day");
      expect(checkDob).to.be.true;
      expect(result.address).to.be.equal(newAddr);
      expect(result.description).to.be.equal(newDesc);
    } catch (error) {
      console.error(error);
      console.error("failed update user 05 unit test.");
    }
  });

  it("06: update user by id, nput no changed informaction by id.", async function () {
    const noInforChangedMsg = "No need to update DB.";
    try {
      const result = await userService.updateById(
        testId,
        newName,
        newDob,
        newAddr,
        newDesc
      );
      expect(result.statusCode).to.be.equal(400);
      expect(result.message).to.be.equal(noInforChangedMsg);
    } catch (error) {
      console.error(error);
      console.error("failed update user 06 unit test.");
    }
  });

  after(async function () {
    await app.models.user.deleteById(testId);
  });
});
