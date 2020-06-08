import mongoose from "mongoose";
import supertest from "supertest";
import { app, config } from "../src/index";
import { DEFAULT_PWD } from "../src/config";
import { usersService } from "../src/services";
import { UserModel } from "../src/models";

export class AppManager {
  constructor() {
    this._server = null;
    this._request = null;
  }

  async start() {
    await mongoose.connect(config.MONGODB_TEST_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await mongoose.connection.db.dropDatabase();
    this._server = app.listen();

    await usersService.createUser({ body: { name: "admin" } });
    const checkAdmin = await UserModel.find({ name: "admin" });
    if (checkAdmin.length > 1) await checkAdmin[0].delete();

    this._request = await supertest(this._server);
    await this.getToken();
  }

  get server() {
    return this._server;
  }

  get config() {
    return config;
  }

  get base() {
    return config.BASE;
  }

  get request() {
    return this._request;
  }

  set token(val) {
    this._token = val;
  }

  get token() {
    return this._token;
  }

  get(router) {
    return this._request
      .get(`${this.base}${router}`)
      .set("Authorization", `Bearer ${this.token}`);
  }

  post(router) {
    if (this.token === "") return this._request.post(`${this.base}${router}`);
    else
      return this._request
        .post(`${this.base}${router}`)
        .set("Authorization", `Bearer ${this.token}`);
  }

  put(router) {
    return this._request
      .put(`${this.base}${router}`)
      .set("Authorization", `Bearer ${this.token}`);
  }

  patch(router) {
    return this._request
      .patch(`${this.base}${router}`)
      .set("Authorization", `Bearer ${this.token}`);
  }

  delete(router) {
    return this._request
      .delete(`${this.base}${router}`)
      .set("Authorization", `Bearer ${this.token}`);
  }

  async stop() {
    await this._server.close();
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }

  async getToken() {
    this.token = "";
    const res = await this.post("/auth/login").send({
      user: "admin",
      password: DEFAULT_PWD,
    });
    this.token = res.body.token;
  }
}

const appManager = new AppManager();

export default appManager;
