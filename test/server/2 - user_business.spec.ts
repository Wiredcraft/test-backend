import * as LibCrypto from "crypto";
import * as chai from "chai";
import * as sinon from "sinon";
import * as uuid from "uuid";
import * as moment from "moment";
import {Response as FetchResponse} from "node-fetch";

import * as UserDao from "../../src/dao/User";
import {User as UserModel} from "../../src/model/User";
import {Config} from "../../src/config/Config";
import {Response} from "../../src/router/Router";

console.log(__filename);

chai.use(require("chai-uuid"));
const expect = chai.expect;
const fetch = require("node-fetch");

const BASE_URL = `http://${Config.get("WEB_HOST", "127.0.0.1")}:${Config.get("WEB_PORT", "8081")}/api/v0.0.1`;

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

describe("SERVER: USER API BUSINESS LOGIC", () => {

  let UID = "";
  let USER = {} as UserModel;

  beforeEach(() => {
    sinon.stub(UserDao, "getUser").callsFake(async (userId: string) => {
      if (userId === UID) {
        return USER;
      } else {
        return null;
      }
    });
    sinon.stub(UserDao, "createUser").callsFake(async (user: UserModel) => {
      USER = user;
      UID = USER.id as string;
      return "OK";
    });
    sinon.stub(UserDao, "updateUser").callsFake(async (user: UserModel) => {
      USER = user;
      return "OK";
    });
    sinon.stub(UserDao, "deleteUser").callsFake(async (userId: string) => {
      if (userId === UID) {
        USER = null;
        UID = "";
      }
      return 1;
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  let UID_IN_CASE = "";
  let USER_IN_CASE = {} as UserModel;

  it("User Business Logic: Get user missing", () => {
    return fetch(`${BASE_URL}/user/${uuid.v4()}`)
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<UserModel | null>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.deep.equal({});
      });
  });

  it("User Business Logic: Create user", () => {
    return fetch(`${BASE_URL}/user`, { // create user
      method: "POST",
      body: JSON.stringify(genFakeUser()),
      headers: {"Content-Type": "application/json"},
    })
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<UserModel>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.not.equal(null);
        expect(json.data).to.include.keys("id", "name", "dob", "address", "description", "createdAt");
        expect(json.data.name).to.include("fake name");
        expect(json.data.address).to.include("fake address");
        expect(json.data.description).to.include("fake description");

        UID_IN_CASE = json.data.id as string;
        USER_IN_CASE = json.data;
      });
  });

  it("User Business Logic: Check created user", () => {
    return fetch(`${BASE_URL}/user/${UID_IN_CASE}`)
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<UserModel | null>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.deep.equal(USER_IN_CASE);
      });
  });

  it("User Business Logic: Update user", () => {
    USER_IN_CASE.name = "new name";

    return fetch(`${BASE_URL}/user`, {
      method: "PUT",
      body: JSON.stringify(USER_IN_CASE),
      headers: {"Content-Type": "application/json"},
    })
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<string>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.equal("OK");
      });
  });

  it("User Business Logic: Check updated user", () => {
    return fetch(`${BASE_URL}/user/${UID_IN_CASE}`)
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<UserModel | null>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.deep.equal(USER_IN_CASE);
      });
  });

  it("User Business Logic: Delete user", () => {
    return fetch(`${BASE_URL}/user/${UID_IN_CASE}`, {method: "DELETE"})
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<string>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.equal("OK");
      });
  });

  it("User Business Logic: Check deleted user", () => {
    return fetch(`${BASE_URL}/user/${UID_IN_CASE}`)
      .then((res: FetchResponse) => {
        expect(res.status).to.be.equal(200);
        return res.json();
      })
      .then((json: Response<UserModel | null>) => {
        expect(json.code).to.be.equal(200);
        expect(json.data).to.be.deep.equal({});
      });
  });
});
