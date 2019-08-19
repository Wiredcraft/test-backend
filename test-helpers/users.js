"use strict";
var Promise = require('promise');

var Chance = require('chance');
var chance = new Chance();

var request = require('supertest');
var server = require('../server').server;

exports.getRandomUser = (type) => {
	return {
		name: chance.name(),
		dob: chance.birthday(),
		address: chance.address(),
		description: chance.sentence()
	};
};
