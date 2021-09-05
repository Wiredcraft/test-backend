import http = require("http");
import request = require("supertest");
import should from "should";
import { app } from "../src/app";
import config from "../src/config";
let server: http.Server;
import async from "async";
import { ErrorCode } from "../src/helpers";

describe("app e2e测试", () => {
    before((done) => {
        server = app.listen(config.PORT, () => {
            console.log(`测试服务器已启动：http://127.0.0.1:${config.PORT}`);
            done();
        });
    });
    after((done) => {
        server.close(done);
    });

    // user

    it("Create User should be success", (done) => {
        request(server)
            .post("/user")
            .send({ name: "john" })
            .expect(200, (err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                should(res.body.statusCode === 200).ok();
                done();
            });
    });

    it("Create User without name be blocked", (done) => {
        request(server)
            .post("/user")
            .send({ name: "" })
            .expect(500, (err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                should(res.body.statusCode === 500).ok();
                done();
            });
    });

    it("Delete User failed if id is invalid", (done) => {
        request(server)
            .delete("/user/invalidId")
            .expect(500, (err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                should(res.body.statusCode === 500).ok();
                done();
            });
    });

    it("Delete User failed if id didnt exist", (done) => {
        request(server)
            .delete("/user/61337806ce9ac27bd79ddb31")
            .expect(200, (err, res) => {
                if (err) {
                    done(err);
                    return;
                }

                should(res.body.reason === ErrorCode.RECORD_NOT_EXIST).ok();
                done();
            });
    });

    it("User API waterfall test", function (done) {
        async.waterfall(
            [
                // create user first
                (cb: any) => {
                    request(server)
                        .post("/user")
                        .send({
                            name: "burlin",
                        })
                        .expect(200, cb);
                },
                //  try to get the detail of the user
                (results: any, cb: any) => {
                    request(server)
                        .get(`/user/${results.body.data._id}`)
                        .expect(200, function (err, res) {
                            should(res.body.data.name === "burlin").ok();
                            cb(null, res.body);
                        });
                },
                // do some changes to the user
                (results: any, cb: any) => {
                    request(server)
                        .put(`/user/${results.data._id}`)
                        .send({
                            name: "burlin",
                            address: "bkk",
                        })
                        .expect(200, function (err, res) {
                            console.log("res put", res.body);

                            should(res.body.data.ok === true).ok();

                            cb(null, res.body);
                        });
                },

                // query the user again
                (results: any, cb: any) => {
                    request(server)
                        .get(`/user/${results.data._id}`)
                        .expect(200, function (err, res) {
                            should(res.body.data.address === "bkk").ok();
                            cb(null, res.body);
                        });
                },
                // delete the user
                (results: any, cb: any) => {
                    request(server)
                        .delete(`/user/${results.data._id}`)
                        .expect(200, function (err, res) {
                            should(res.body.data.ok === true).ok();

                            cb(null, res.body);
                        });
                },
                // after delete the user, the user is null
                (results: any, cb: any) => {
                    request(server)
                        .get(`/user/${results.data._id}`)
                        .expect(200, function (err, res) {
                            should(res.body.data === null).ok();

                            cb(null, res.body);
                        });
                },
            ],
            (err, results) => {
                if (err) {
                    done(err);
                    return;
                }
                done();
            }
        );
    });
    //
});
