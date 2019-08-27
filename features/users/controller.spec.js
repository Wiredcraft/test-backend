"use strict";
var log = require("color-logs")(true, true, __filename);
var expect = require('chai').expect;
var sinon = require('sinon');
var Chance = require('chance');
var chance = new Chance();

var mocks = require('../../test-helpers/_mocks');
var helpers = require('../../test-helpers/_helpers');

var Model = require('./model');

describe('Users controller', () => {
	var controller;
  var sandbox;
  var onSuccess;

  var tempId;

  before((done) => {
    this.sandbox = sinon.sandbox.create();
    this.controller = require('./controller');
    this.onSuccess = this.sandbox.stub(this.controller, "success");
    helpers.db_open(done);
  });
  after((done) => {
    this.sandbox.restore();
    helpers.db_close(done);
  });

  it('should create user', (done) => {
  	let model = {
    	name: chance.name(),
      email: chance.email(),
      password: chance.hash(),
  	};
    this.onSuccess.callsFake((res, data) => {
      expect(data.name).to.be.equal(model.name);
      expect(data._id).to.not.be.null;
      this.tempId = data._id;
      done();
    });

    this.controller.createUser({ body: model }, null);

  });

  it('should return correct lists', (done) => {
    let insertModels = async () => {
      let modelFactory = mocks.Users.getRandomUser;
      this.sandbox.restore();
      this.sandbox.stub(this.controller, "success");
      await this.controller.createUser({ body: modelFactory() });
      await this.controller.createUser({ body: modelFactory() });
      await this.controller.createUser({ body: modelFactory() });
      await this.controller.createUser({ body: modelFactory() });
      await this.controller.createUser({ body: modelFactory() });
    }

    insertModels().then(() => {
      this.sandbox.restore();
      this.sandbox.stub(this.controller, "success")
        .callsFake((res, data) => {
          expect(data.length).to.be.equal(6);
          done();
        });
      this.controller.getUsers({ params: false });
    });
  });

});
