const {
    format, //format(err, res, body, done)
    objectModelRequest,
    upmRequest
} = require("../test/util");
const fs = require("fs");
const path = require("path");
describe("users", function () {
    this.timeout(5000);
    
    // 新建
	it('create', function (done) {
		objectModelRequest({
			url: "/user",
			method: "post",
			body: {
                "name": "",
                "dob": "2021-08-06T05:55:56.000Z",
                "address": {
					"lat": 1.1, 
					"lng": 2.4
				},
                "description": "",
                "createdBy": 1,
                "updatedBy": 1,
                "createdAt": "2021-08-06T05:55:56.000Z",
                "updatedAt": "2021-08-06T05:55:56.000Z",
                "status": "1",
            },
			json: true
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});

    // 列表
    it('list', function (done) {
		objectModelRequest({
			url: "/user/list",
			method: "get",
            qs: {
                keywords: "",
                sort: "createdAt",
                sortBy: "DESC"
            },
            json: true
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});

    // 分页
	it("pages", function (done) {
		objectModelRequest({
			url: "/user/pages",
			method: "get",
			json: true,
			qs: {
				pageIndex: 1,
				pageSize: 10,
                keywords: "keywords",
                order: "ASC", // ASC 正序， DESC 倒序			
                orderBy: "createdAt",
            }
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});

    it('query', function (done) {
		objectModelRequest({
			url: `/user/1`,
			method: "get",
			json: true
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});

    it('update', function (done) {
		objectModelRequest({
			url: "/user/1",
			method: "put",
			body: {
                "name": "",
                "dob": "2021-08-06T05:55:56.000Z",
                "address": {
					"lat": 1.1, 
					"lng": 2.4
				},
                "description": "",
                "createdBy": 1,
                "updatedBy": 1,
                "createdAt": "2021-08-06T05:55:56.000Z",
                "updatedAt": "2021-08-06T05:55:56.000Z",
                "status": "1",
            },
			json: true
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});

    it("remove", function (done) {
		webRequest({
			url: "/user/1",
			method: "delete",
			json: true
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});	

    it('checkName', function (done) {
		objectModelRequest({
			url: `/user/checkName`,
			method: "get",
			qs: {
				name: ""
			},
		}, function (err, res, body) {
			format(err, res, body, done)
		});
	});

});