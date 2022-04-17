"use strict";

const expect = require("chai").expect;
const app = require("../server/server.js");
const moment = require("moment");
const userService = require("../common/services/user.service.js");

describe("Unit tests for create user.", function () {
  this.timeout(10000);
  let id = "";
  it("create new user.", async function () {
    try {
      const name = "Nike Wang";
      const dob = new Date("2000-10-9");
      const address = "Nanchen Road 259#, Baoshan District, Shanghai";
      const description = "test user";
      const result = await userService.createUser(
        name,
        dob,
        address,
        description
      );
      expect(result).to.have.property("id");
      expect(result).to.have.property("name");
      expect(result).to.have.property("dob");
      expect(result).to.have.property("address");
      expect(result).to.have.property("description");
      expect(result.name).to.be.equal(name);
      const checkDob = moment(result.dob).isSame(dob, "day");
      expect(checkDob).to.be.true;
      expect(result.address).to.be.equal(address);
      expect(result.description).to.be.equal(description);
      id = result.id;
    } catch (error) {
      console.error(error);
      console.error("failed create new user unit test.");
    }
  });

  after(async function () {
    await app.models.user.deleteById(id);
  });
});
