import app from "./app-manager";
import { createUser } from "./util";
import { DEFAULT_PWD } from "../src/config";

describe("Authentication service", () => {
  beforeEach(async () => {
    await app.start();
  });

  afterEach(async () => {
    await app.stop();
  });

  it("should work only with valid token", async () => {
    await app.get("/users").expect(200);

    const saveToken = app.token;
    app.token = "wrongToken";
    await app.get("/users").expect(401);

    app.token = saveToken;
    await app.get("/users").expect(200);
  });

  it("should login to get token", async () => {
    const user = await createUser();
    app.token = "";
    await app.get("/users").expect(401);

    const res = await app.post("/auth/login").send({
      user: user.name,
      password: DEFAULT_PWD,
    });
    app.token = res.body.token;

    await app.get("/users").expect(200);
  });

  it("should logout to make token invalid", async () => {
    const user = await createUser();
    const res = await app.post("/auth/login").send({
      user: user.name,
      password: DEFAULT_PWD,
    });
    app.token = res.body.token;

    await app.get("/users").expect(200);

    await app.delete("/auth/logout").expect(204);

    await app.get("/users").expect(401);
  });
});
