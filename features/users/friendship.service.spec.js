"use strict";
var log = require("color-logs")(true, true, __filename);
var expect = require('chai').expect;
var sinon = require('sinon');
var helpers = require('../../test-helpers/_helpers');

var Friendship = require('./friendship.service');
var UserService = require('./controller');
var mocks = require('../../test-helpers/_mocks');

 
describe('Friendship Service', () => {

  before((done) => {
    this.sandbox = sinon.sandbox.create();
    helpers.db_open(done);
  });
  after((done) => {
    this.sandbox.restore();
    helpers.db_close(done);
  });

  it('should estabilish a friendship mutually', async () => {
    let user1 = await UserService.createUser({ body: mocks.Users.getRandomUser() });
    let user2 = await UserService.createUser({ body: mocks.Users.getRandomUser() });

    try {
      let friendship = await Friendship.makeFriend(user1.id, user2.id);
    } catch(err) {
      log.error(err);
    }

    let friendsFrom1 = await Friendship.getFriends(user1.id);
    expect(friendsFrom1[0].id).to.be.equal(user2.id);
    expect(friendsFrom1[0].name).to.be.equal(user2.name);

    let friendsFrom2 = await Friendship.getFriends(user2.id);
    expect(friendsFrom2[0].id).to.be.equal(user1.id);
    expect(friendsFrom2[0].email).to.be.equal(user1.email);

  });

  it('should deal well with friendships', async () => {
    let user1 = await UserService.createUser({ body: mocks.Users.getRandomUser() });
    let user2 = await UserService.createUser({ body: mocks.Users.getRandomUser() });
    let user3 = await UserService.createUser({ body: mocks.Users.getRandomUser() });
    let user4 = await UserService.createUser({ body: mocks.Users.getRandomUser() });

    try {
      await Friendship.makeFriend(user1.id, user2.id);
      await Friendship.makeFriend(user1.id, user3.id);
      await Friendship.makeFriend(user1.id, user4.id);
    } catch(err) {
      log.error(err);
    }

    let friendsFrom1 = await Friendship.getFriends(user1.id);
    expect(friendsFrom1.length).to.be.equal(3);

    let friendsFrom3 = await Friendship.getFriends(user3.id);
    expect(friendsFrom3.length).to.be.equal(1);
    expect(friendsFrom3[0].name).to.be.equal(user1.name);

    try {
      await Friendship.breakUp(user1.id, user2.id);
    } catch(err) {
      log.error(err);
    }
    friendsFrom1 = await Friendship.getFriends(user1.id);
    expect(friendsFrom1.length).to.be.equal(2);
    let friendsFrom2 = await Friendship.getFriends(user2.id);
    expect(friendsFrom2.length).to.be.equal(0);


  });


});
