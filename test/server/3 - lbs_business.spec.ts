import * as LibCrypto from "crypto";
import * as chai from "chai";
import * as sinon from "sinon";
import * as moment from "moment";
import {Response as FetchResponse} from "node-fetch";

import * as UserDao from "../../src/dao/User";
import {User as UserModel} from "../../src/model/User";
import {Config} from "../../src/config/Config";
import {Response} from "../../src/router/Router";
import * as UserLinkDao from "../../src/dao/UserLink";
import * as UserGeoDao from "../../src/dao/UserGeo";
import {UserGeo as UserGeoModel} from "../../src/model/UserGeo";

chai.use(require("chai-uuid"));
const expect = chai.expect;
const fetch = require("node-fetch");

const BASE_URL = `http://${Config.get("WEB_HOST", "127.0.0.1")}:${Config.get("WEB_PORT", "8081")}/api/v0.0.1`;

console.log(__filename);

const genFakeUser = () => {
  const genRandomStr = (len: number) => {
    return LibCrypto.randomBytes(len).toString("hex");
  };

  return {
    name: `fake name ${genRandomStr(5)}`,
    dob: moment().unix() - 31536000,
    address: `fake address ${genRandomStr(5)}`,
    description: `fake description ${genRandomStr(5)}`,
    createdAt: moment().unix() - 1000,
  } as UserModel;
};

describe("SERVER: USER LBS API BUSINESS LOGIC", () => {
  const POS_CENTER = ["31.225335", "121.492653"]; // 上海城隍庙
  const POS_NEARBY1 = ["31.225206", "121.495442"]; // 上海四牌楼
  const POS_NEARBY2 = ["31.224582", "121.489177"]; // 上海老街
  const POS_OUT_OF_RANGE = ["39.903942", "116.397743"]; // 北京天安门广场

  const USER_CENTER = genFakeUser();
  const USER_NEARBY1 = genFakeUser();
  const USER_NEARBY2 = genFakeUser();
  const USER_OUT_OF_RANGE = genFakeUser();
  const USERS = [USER_CENTER, USER_NEARBY1, USER_NEARBY2, USER_OUT_OF_RANGE];

  const FRIEND_IDS_OF_CENTER = [];

  beforeEach(() => {
    sinon.stub(UserDao, "getUser").callsFake(async (userId: string) => {
      return USERS.filter((ele: UserModel) => ele.id === userId).shift() as UserModel;
    });
    sinon.stub(UserDao, "createUser").callsFake(async (user: UserModel) => {
      return "OK";
    });
    sinon.stub(UserLinkDao, "followUser").callsFake(async (userId: string, targetId: string) => {
      if (targetId === USER_CENTER.id) {
        FRIEND_IDS_OF_CENTER.push(userId);
      }
    });
    sinon.stub(UserLinkDao, "getFollowers").callsFake(async (userId: string) => {
      if (userId === USER_CENTER.id) {
        return FRIEND_IDS_OF_CENTER;
      } else {
        return [];
      }
    });
    sinon.stub(UserGeoDao, "saveUserGeo").callsFake(async (userGeo: UserGeoModel) => {
      return 1;
    });
    sinon.stub(UserGeoDao, "getNearbyUserIds").callsFake(async (userId: string) => {
      if (userId === USER_CENTER.id) {
        return [USER_CENTER.id, USER_NEARBY1.id, USER_NEARBY2.id];
      } else {
        return [];
      }
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("User LBS Business logic: Create users", () => {
    return Promise.all(USERS.map((ele: UserModel) => {
      return fetch(`${BASE_URL}/user`, {
        method: "POST", body: JSON.stringify(ele), headers: {"Content-Type": "application/json"},
      });
    }))
      .then((results: FetchResponse[]) => {
        return Promise.all(results.map((res: FetchResponse) => {
          expect(res.status).to.be.equal(200);
          return res.json();
        }));
      })
      .then((jsons: Array<Response<UserModel>>) => {
        for (const [, json] of jsons.entries()) {
          expect(json.code).to.be.equal(200);

          USERS.forEach((ele: UserModel) => {
            if (json.data.name === ele.name) {
              ele.id = json.data.id;
            }
          });
        }
      });
  });

  it("User LBS Business Logic: Add friends", () => {
    return Promise.all([USER_NEARBY1, USER_NEARBY2, USER_OUT_OF_RANGE].map((ele: UserModel) => {
      return fetch(`${BASE_URL}/userlink/follow`, {
        method: "POST",
        body: JSON.stringify({userId: ele.id, targetId: USER_CENTER.id}),
        headers: {"Content-Type": "application/json"},
      });
    }))
      .then((results: FetchResponse[]) => {
        return Promise.all(results.map((res: FetchResponse) => {
          expect(res.status).to.be.equal(200);
          return res.json();
        }));
      })
      .then((jsons: Array<Response<string>>) => {
        for (const [, json] of jsons.entries()) {
          expect(json.code).to.be.equal(200);
          expect(json.data).to.be.equal("OK");
        }
      });
  });

  it("User LBS Business Logic: Check friends", () => {
    return fetch(`${BASE_URL}/userlink/follower/${USER_CENTER.id}`)
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<string[]>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.have.lengthOf(3);
        expect(json.data).to.includes(USER_NEARBY1.id);
        expect(json.data).to.includes(USER_NEARBY2.id);
        expect(json.data).to.includes(USER_OUT_OF_RANGE.id);
      });
  });

  it("User LBS Business Logic: Save positions", () => {
    return Promise.all([
      fetch(`${BASE_URL}/usergeo`, {
        method: "POST",
        body: JSON.stringify({
          id: USER_CENTER.id,
          latitude: POS_CENTER[0],
          longitude: POS_CENTER[1],
        } as UserGeoModel),
        headers: {"Content-Type": "application/json"},
      }),
      fetch(`${BASE_URL}/usergeo`, {
        method: "POST",
        body: JSON.stringify({
          id: USER_NEARBY1.id,
          latitude: POS_NEARBY1[0],
          longitude: POS_NEARBY1[1],
        } as UserGeoModel),
        headers: {"Content-Type": "application/json"},
      }),
      fetch(`${BASE_URL}/usergeo`, {
        method: "POST",
        body: JSON.stringify({
          id: USER_NEARBY2.id,
          latitude: POS_NEARBY2[0],
          longitude: POS_NEARBY2[1],
        } as UserGeoModel),
        headers: {"Content-Type": "application/json"},
      }),
      fetch(`${BASE_URL}/usergeo`, {
        method: "POST",
        body: JSON.stringify({
          id: USER_OUT_OF_RANGE.id,
          latitude: POS_OUT_OF_RANGE[0],
          longitude: POS_OUT_OF_RANGE[1],
        } as UserGeoModel),
        headers: {"Content-Type": "application/json"},
      }),
    ])
      .then((results: FetchResponse[]) => {
        return Promise.all(results.map((res: FetchResponse) => {
          expect(res.status).to.be.equal(200);
          return res.json();
        }));
      })
      .then((jsons: Array<Response<string>>) => {
        for (const [, json] of jsons.entries()) {
          expect(json.code).to.be.equal(200);
          expect(json.data).to.be.equal("OK");
        }
      });
  });

  it("User LBS Business Logic: Search nearby friends", () => {
    return fetch(`${BASE_URL}/usergeo/nearby/${USER_CENTER.id}`)
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<string[]>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.have.lengthOf(2);
        expect(json.data).to.includes(USER_NEARBY1.id);
        expect(json.data).to.includes(USER_NEARBY2.id);
      });
  });
});
