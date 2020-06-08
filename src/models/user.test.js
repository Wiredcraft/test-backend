import mongoose from "mongoose";
import User from "./user";
import { MONGODB_TEST_CONNECTION } from "../config";

const UserSample = {
  name: "jacky", // user name
};
// generateUser will produce data doc for tests
const generateUser = properties => ({ ...UserSample, ...properties });

describe("User model", () => {
  beforeAll(async () => {
    mongoose.Promise = Promise;
  });

  beforeEach(async () => {
    await mongoose.connect(MONGODB_TEST_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.connect(MONGODB_TEST_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should insert a doc into collection", async () => {
    const doc = generateUser();
    const testUser = await User.create({
      ...doc,
    });
    expect(testUser.toJSON()).toEqual(expect.objectContaining(doc));
  });

  it("should list users", async () => {
    const userCount = 10;
    const users = [];
    for (let i = 0; i < userCount; i++) {
      const newUser = await User.create(generateUser());
      users.push(newUser.toJSON());
    }

    expect((await User.list()).docs.length).toEqual(userCount);

    const userCount2 = 13;
    for (let i = 0; i < userCount2; i++) {
      const newUser = await User.create(generateUser());
      users.push(newUser.toJSON());
    }
    expect((await User.list({ limit: 10000 })).docs.length).toEqual(
      users.length
    );
    expect((await User.list({ limit: 10 })).docs.length).toEqual(10);
    expect((await User.list({ limit: 10000 })).docs[0].toJSON()).toEqual(
      users[22]
    );
    expect(
      (await User.list({ offset: 10, limit: 10 })).docs[0].toJSON()
    ).toEqual(users[12]);
    expect(
      (
        await User.list({ offset: 10, limit: 10, sort: "updated" })
      ).docs[0].toJSON()
    ).toEqual(users[10]);
  });
});
