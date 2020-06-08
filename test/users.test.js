import app from "./app-manager";
import { createUser } from "./util";

describe("Users service", () => {
  beforeEach(async () => {
    await app.start();
  });

  afterEach(async () => {
    await app.stop();
  });

  it("should create user", async () => {
    const oldUserList = await (await app.get("/users").expect(200)).body;
    expect(oldUserList.length).toEqual(1);

    const userTom = await createUser("Tom");

    expect(userTom).toEqual(expect.objectContaining({ name: "Tom" }));

    const newUserList = await (await app.get("/users").expect(200)).body;

    // after create the user, the user list increased, with the new user in it
    expect(newUserList.length).toEqual(2);
    expect(newUserList).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Tom" })])
    );
  });

  it("should not create user without name", async () => {
    const beforeUserList = await (await app.get("/users").expect(200)).body;

    // try to create a user without name
    // it will fail
    await app
      .post("/users")
      .send({ github: "jack" })
      .expect(404);

    const afterUserList = await (await app.get("/users").expect(200)).body;
    expect(afterUserList.length).toEqual(beforeUserList.length);
  });

  it("should not create user with repeat name", async () => {
    await createUser("Tom");
    const beforeUserList = await (await app.get("/users").expect(200)).body;

    // try to create a user with repeat name
    // it will fail
    await app
      .post("/users")
      .send({ name: "Tom" })
      .expect(404);

    const afterUserList = await (await app.get("/users").expect(200)).body;
    expect(afterUserList.length).toEqual(beforeUserList.length);
  });

  it("should get user by id", async () => {
    const tom = { name: "Tom", github: "tom" };
    const userTom = await app
      .post("/users")
      .send(tom)
      .expect(201);

    const res = await app.get(`/users/${userTom.body.id}`).expect(200);
    expect(res.body).toEqual(expect.objectContaining(userTom.body));
  });

  it("should get error by wrong id", async () => {
    const wrongId = "5edb9c432eb83b3b95717480";
    await app.get(`/users/${wrongId}`).expect(404);
  });

  it("should update user", async () => {
    const tom = { name: "Tom", github: "tom" };
    const userTom = await app
      .post("/users")
      .send(tom)
      .expect(201);

    const newTom = { github: "newTom" };

    await app
      .patch(`/users/${userTom.body.id}`)
      .send(newTom)
      .expect(200);

    const res = await app.get(`/users/${userTom.body.id}`).expect(200);
    expect(res.body).toEqual(expect.objectContaining(newTom));
  });

  it("should delete user", async () => {
    const userTom = await createUser("Tom");
    await app.delete(`/users/${userTom.id}`).expect(204);
    const res = await app.get(`/users/${userTom.id}`);
    expect(res.body).toEqual(expect.objectContaining({ deleted: true }));
  });

  it("should list users", async () => {
    const userJack = await createUser("Jack");
    const userTom = await createUser("Tom");
    const userAlice = await createUser("Alice");
    const userBob = await createUser("Bob");

    const res = await app.get("/users").expect(200);

    // We created 4 new users here.
    // With admin user, we will get a 5 user list.
    expect(res.body.length).toEqual(5);
    expect(res.body[0]).toEqual(
      expect.objectContaining({ name: "Bob", id: userBob.id })
    );
    expect(res.body[1]).toEqual(
      expect.objectContaining({ name: "Alice", id: userAlice.id })
    );
    expect(res.body[2]).toEqual(
      expect.objectContaining({ name: "Tom", id: userTom.id })
    );
    expect(res.body[3]).toEqual(
      expect.objectContaining({ name: "Jack", id: userJack.id })
    );
  });
});
