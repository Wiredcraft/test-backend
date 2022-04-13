"use strict";

const expect = require("chai").expect;
const app = require("../server/server.js");
const request = require("supertest");
const moment = require("moment");

describe("Unit tests for user: create, query, update, delete.", function () {
  this.timeout(10000);
  before(async function () {
    //token process
  });

  let id = "";
  const name = "Nike Wang";
  const dob = new Date("2000-10-9");
  const address = "Nanchen Road 259#, Baoshan District, Shanghai";
  const description = "test user";
  const newName = "Alice Zhao";
  const newDob = new Date("1978-7-25");
  const newAddr = "Nanjing West Road 1038#, Jing'an District, Shanghai ";
  const newDesc = "test update user";
  const nonexistedId = "123456789000";

  it(`Case 01: create a new user.`, (done) => {
    let formData = {};
    formData.name = name;
    formData.dob = dob;
    formData.address = address;
    formData.description = description;
    request(app)
      .post(`/api/user`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
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
      })
      .end(done);
  });

  it(`Case 02: find all user.`, (done) => {
    request(app)
      .get(`/api/user`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result).to.have.property("size");
        expect(result).to.have.property("data");
        expect(result.size).to.be.gte(1);
        for (let user of result.data) {
          expect(user).to.have.property("id");
          expect(user).to.have.property("name");
          expect(user).to.have.property("dob");
          expect(user).to.have.property("address");
        }
      })
      .end(done);
  });

  it(`Case 03: find user by id.`, (done) => {
    request(app)
      .get(`/api/user/${id}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
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
      })
      .end(done);
  });

  it(`Case 03-1: find user by id, non existed id.`, (done) => {
    const msg = "Not Found";
    request(app)
      .get(`/api/user/${nonexistedId}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(404);
        expect(result.message).to.be.equal(msg);
      })
      .end(done);
  });

  it(`Case 04: update user by id.`, (done) => {
    let formData = {};
    formData.name = newName;
    formData.dob = newDob;
    formData.address = newAddr;
    formData.description = newDesc;
    request(app)
      .patch(`/api/user/${id}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result).to.have.property("id");
        expect(result).to.have.property("name");
        expect(result).to.have.property("dob");
        expect(result).to.have.property("address");
        expect(result).to.have.property("description");
        expect(result.id).to.be.equal(id);
        expect(result.name).to.be.equal(newName);
        const checkDob = moment(result.dob).isSame(newDob, "day");
        expect(checkDob).to.be.true;
        expect(result.address).to.be.equal(newAddr);
        expect(result.description).to.be.equal(newDesc);
      })
      .end(done);
  });

  it(`Case 04-1: update user by id, no input informaction except id.`, (done) => {
    let formData = {};
    const noInforMsg = "No information input, no change.";
    request(app)
      .patch(`/api/user/${id}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(400);
        expect(result.message).to.be.equal(noInforMsg);
      })
      .end(done);
  });

  it(`Case 04-2: update user by id, input empty informaction except id.`, (done) => {
    let formData = {};
    formData.name = " ";
    formData.address = " ";
    formData.description = " ";
    const noInforMsg = "No information input, no change.";
    request(app)
      .patch(`/api/user/${id}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(400);
        expect(result.message).to.be.equal(noInforMsg);
      })
      .end(done);
  });

  it(`Case 04-3: update user by id, input empty informaction except id.`, (done) => {
    let formData = {};
    formData.name = "     ";
    const noInforMsg = "No information input, no change.";
    request(app)
      .patch(`/api/user/${id}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(400);
        expect(result.message).to.be.equal(noInforMsg);
      })
      .end(done);
  });

  it(`Case 04-4: update user by id, input non existed id.`, (done) => {
    let formData = {};
    formData.name = newName;
    formData.dob = newDob;
    formData.address = newAddr;
    formData.description = newDesc;
    const noUserForIdMsg = `No user found for input id: ${nonexistedId}.`;
    request(app)
      .patch(`/api/user/${nonexistedId}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(404);
        expect(result.message).to.be.equal(noUserForIdMsg);
      })
      .end(done);
  });

  it(`Case 04-5: update user by id, input no changed informaction by id.`, (done) => {
    let formData = {};
    formData.name = newName;
    formData.dob = newDob;
    formData.address = newAddr;
    formData.description = newDesc;
    const noInforChangedMsg =
      "The input information are the same as in DB, no change.";
    request(app)
      .patch(`/api/user/${id}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(400);
        expect(result.message).to.be.equal(noInforChangedMsg);
      })
      .end(done);
  });

  it(`Case 04-6: update user by id, input no changed informaction by id.`, (done) => {
    let formData = {};
    formData.dob = newDob;
    formData.address = newAddr;
    const noInforChangedMsg =
      "The input information are the same as in DB, no change.";
    request(app)
      .patch(`/api/user/${id}`)
      .send(formData)
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.statusCode).to.be.equal(400);
        expect(result.message).to.be.equal(noInforChangedMsg);
      })
      .end(done);
  });

  it(`Case 05: delete the user.`, (done) => {
    request(app)
      .delete(`/api/user/${id}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.error).to.be.false;
        const result = res.body;
        expect(result.count).to.be.equal(1);
      })
      .end(done);
  });
});
