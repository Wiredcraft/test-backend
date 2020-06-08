import mongoose from "mongoose";
import Session from "./session";
import { MONGODB_TEST_CONNECTION } from "../config";

const sessionSample = {
  user: "123456", // user id
  type: "password", // login type("password", "github")
};
// generateSession will produce data doc for tests
const generateSession = properties => ({ ...sessionSample, ...properties });

describe("Session model", () => {
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
    const doc = generateSession();
    const testSession = await Session.create({
      ...doc,
    });
    expect(testSession.toJSON()).toEqual(expect.objectContaining(doc));
  });

  it("should list sessions", async () => {
    const sessionCount = 10;
    const sessions = [];
    for (let i = 0; i < sessionCount; i++) {
      const newSession = await Session.create(generateSession());
      sessions.push(newSession.toJSON());
    }

    expect((await Session.list()).docs.length).toEqual(sessionCount);

    const sessionCount2 = 13;
    for (let i = 0; i < sessionCount2; i++) {
      const newSession = await Session.create(generateSession());
      sessions.push(newSession.toJSON());
    }
    expect((await Session.list({ limit: 10000 })).docs.length).toEqual(
      sessions.length
    );
    expect((await Session.list({ limit: 10 })).docs.length).toEqual(10);
    expect((await Session.list({ limit: 10000 })).docs[0].toJSON()).toEqual(
      sessions[22]
    );
    expect(
      (await Session.list({ offset: 10, limit: 10 })).docs[0].toJSON()
    ).toEqual(sessions[12]);
  });
});
