import app from "./app-manager";
import { createUser, createFriendship } from "./util";

describe("Authentication service", () => {
  beforeEach(async () => {
    await app.start();
  });

  afterEach(async () => {
    await app.stop();
  });

  it("should create friendship", async () => {
    const userJack = await createUser("Jack");
    const userTom = await createUser("Tom");

    const res = await createFriendship(userJack.id, userTom.id);

    expect(res).toEqual(
      expect.objectContaining({ from: userJack.id, to: userTom.id })
    );
  });

  it("should not be friend to himself", async () => {
    const userJack = await createUser("Jack");

    await app
      .post(`/friendships/edit/${userJack.id}/${userJack.id}`)
      .expect(400);
  });

  it("should be two user id only", async () => {
    const userJack = await createUser("Jack");
    const notUser = "wrongId";

    await app.post(`/friendships/edit/${userJack.id}`).expect(404);

    await app.post(`/friendships/edit/${notUser}/${userJack.id}`).expect(400);

    await app.post(`/friendships/edit/${userJack.id}/${notUser}`).expect(400);
  });

  it("should list followings", async () => {
    const userJack = await createUser("Jack");
    const userTom = await createUser("Tom");

    const beforeFollowings = await app
      .get(`/friendships/from/${userJack.id}`)
      .expect(200);
    expect(beforeFollowings.body.length).toStrictEqual(0);

    await createFriendship(userJack.id, userTom.id);

    const afterFollowings = await app
      .get(`/friendships/from/${userJack.id}`)
      .expect(200);

    // After new friendship is created,
    // list length increased, and the content is correct
    expect(afterFollowings.body.length).toStrictEqual(1);
    expect(afterFollowings.body[0]).toEqual(
      expect.objectContaining({ name: "Tom", id: userTom.id })
    );

    const userAlice = await createUser("Alice");
    const userBob = await createUser("Bob");
    await createFriendship(userJack.id, userAlice.id);
    await createFriendship(userJack.id, userBob.id);

    const newFollowings = await app
      .get(`/friendships/from/${userJack.id}`)
      .expect(200);

    // After new friendships are created,
    // list length increased, and the content is correct
    expect(newFollowings.body.length).toStrictEqual(3);
    expect(newFollowings.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Alice", id: userAlice.id }),
      ])
    );
    expect(newFollowings.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Bob", id: userBob.id }),
      ])
    );
  });

  it("should list followers", async () => {
    const userJack = await createUser("Jack");
    const userTom = await createUser("Tom");

    const beforeFollowers = await app
      .get(`/friendships/to/${userJack.id}`)
      .expect(200);
    expect(beforeFollowers.body.length).toStrictEqual(0);

    await createFriendship(userTom.id, userJack.id);

    const afterFollowers = await app
      .get(`/friendships/to/${userJack.id}`)
      .expect(200);

    // After new friendship is created,
    // list length increased, and the content is correct
    expect(afterFollowers.body.length).toStrictEqual(1);
    expect(afterFollowers.body[0]).toEqual(
      expect.objectContaining({ name: "Tom", id: userTom.id })
    );

    const userAlice = await createUser("Alice");
    const userBob = await createUser("Bob");
    await createFriendship(userAlice.id, userJack.id);
    await createFriendship(userBob.id, userJack.id);

    const newFollowers = await app
      .get(`/friendships/to/${userJack.id}`)
      .expect(200);

    // After new friendships are created,
    // list length increased, and the content is correct
    expect(newFollowers.body.length).toStrictEqual(3);
    expect(newFollowers.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Alice", id: userAlice.id }),
      ])
    );
    expect(newFollowers.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Bob", id: userBob.id }),
      ])
    );
  });

  it("should delete friendship", async () => {
    const userJack = await createUser("Jack");
    const userTom = await createUser("Tom");
    const userAlice = await createUser("Alice");
    const userBob = await createUser("Bob");

    await createFriendship(userTom.id, userJack.id);
    await createFriendship(userAlice.id, userJack.id);
    await createFriendship(userBob.id, userJack.id);

    const beforeFollowers = await app
      .get(`/friendships/to/${userJack.id}`)
      .expect(200);

    expect(beforeFollowers.body.length).toStrictEqual(3);
    expect(beforeFollowers.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Alice", id: userAlice.id }),
      ])
    );
    expect(beforeFollowers.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Bob", id: userBob.id }),
      ])
    );

    await app
      .delete(`/friendships/edit/${userAlice.id}/${userJack.id}`)
      .expect(204);
    const afterFollowers = await app
      .get(`/friendships/to/${userJack.id}`)
      .expect(200);

    // After delete friendship, the follower list decreased,
    // and the deleted friendship disappeared
    expect(afterFollowers.body.length).toStrictEqual(2);

    expect(afterFollowers.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Alice", id: userAlice.id }),
      ])
    );

    expect(afterFollowers.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Bob", id: userBob.id }),
      ])
    );
  });

  it("should not delete nonexistent friendship", async () => {
    const userJack = await createUser("Jack");
    const userTom = await createUser("Tom");

    await app
      .delete(`/friendships/edit/${userTom.id}/${userJack.id}`)
      .expect(404);
  });
});
