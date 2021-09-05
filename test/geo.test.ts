import http = require("http");
import request = require("supertest");
import should from "should";
import { app } from "../src/app";
import config from "../src/config";
let server: http.Server;
import async from "async";
import { ErrorCode } from "../src/helpers";

describe("nearby e2e test", () => {
    before((done) => {
        server = app.listen(config.PORT, () => {
            console.log(`测试服务器已启动：http://127.0.0.1:${config.PORT}`);
            done();
        });
    });
    after((done) => {
        server.close(done);
    });

    const mockUserId = "61338e850cda4c970e3abecd";

    const mockUserId2 = "61338e850cda4c970e3abecc";

    it("User API waterfall test", function (done) {
        async.waterfall(
            [
                // upsert another
                (cb: any) => {
                    request(server)
                        .put(`/user/${mockUserId}/geo`)
                        .send({
                            geo: [104.05801, 30.5412],
                        })
                        .expect(200, cb);
                },
                // upsert another user's geo
                (results: any, cb: any) => {
                    request(server)
                        .put(`/user/${mockUserId2}/geo`)
                        .send({
                            geo: [104.05801, 30.5413],
                        })
                        .expect(200, function (err, res) {
                            cb(null, res.body);
                        });
                },
                (results: any, cb: any) => {
                    request(server)
                        .get(
                            `/user/${mockUserId}/nearby?limit=10&offset=0&distance=1000`
                        )

                        .expect(200, function (err, res) {
                            console.log("nearby", res.body);
                            should(res.body.data.count === 1).ok();

                            cb(null, res.body);
                        });
                },

                // update the user geo to more than 1000m
                (results: any, cb: any) => {
                    request(server)
                        .put(`/user/${mockUserId2}/geo`)
                        .send({
                            geo: [103.05801, 30.5413],
                        })
                        .expect(200, function (err, res) {
                            cb(null, res.body);
                        });
                },

                // after changing the geo of mockUserId2
                // the number of  mockUserId1 nearby will be
                (results: any, cb: any) => {
                    request(server)
                        .get(
                            `/user/${mockUserId}/nearby?limit=10&offset=0&distance=1000`
                        )
                        .expect(200, function (err, res) {
                            console.log("res", res.body);
                            should(res.body.data.count === 0).ok();

                            cb(null, res.body);
                        });
                },

                // // delete the user
                // (results: any, cb: any) => {
                //     request(server)
                //         .delete(`/user/${results.data._id}`)
                //         .expect(200, function (err, res) {
                //             should(res.body.data.ok === true).ok();

                //             cb(null, res.body);
                //         });
                // },
                // // after delete the user, the user is null
                // (results: any, cb: any) => {
                //     request(server)
                //         .get(`/user/${results.data._id}`)
                //         .expect(200, function (err, res) {
                //             should(res.body.data === null).ok();

                //             cb(null, res.body);
                //         });
                // },
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
