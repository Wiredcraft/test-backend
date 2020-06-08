import mongoose from "mongoose";
import Friendship from "./friendship";
import { MONGODB_TEST_CONNECTION } from "../config";

const friendshipSample = {
    from: "123456", // follower id
    to: "654321", // following id
};
// generateFriendship will produce data doc for tests
const generateFriendship = properties => ({ ...friendshipSample, ...properties });

describe("Friendship model", () => {
    beforeAll(async () => {
        mongoose.Promise = Promise;
    });

    beforeEach(async () => {
        await mongoose.connect(MONGODB_TEST_CONNECTION, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        await mongoose.connection.db.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.connection.close();
    });

    it("should insert a doc into collection", async () => {
        const doc = generateFriendship();
        const testFriendship = await Friendship.create({
            ...doc,
        });
        expect(testFriendship.toJSON()).toEqual(expect.objectContaining(doc));
    });

    it("should list friendships", async () => {
        const friendshipCount = 10;
        const friendships = []
        for (let i = 0; i < friendshipCount; i++) {
            const newFriendship = await Friendship.create(generateFriendship())
            friendships.push(newFriendship.toJSON())
        }

        expect((await Friendship.list()).docs.length).toEqual(friendshipCount);

        const friendshipCount2 = 13;
        for (let i = 0; i < friendshipCount2; i++) {
            const newFriendship = await Friendship.create(generateFriendship())
            friendships.push(newFriendship.toJSON())
        }
        expect((await Friendship.list({ limit: 10000 })).docs.length).toEqual(friendships.length);
        expect((await Friendship.list({ limit: 10 })).docs.length).toEqual(10);
        expect((await Friendship.list({ limit: 10000 })).docs[0].toJSON()).toEqual(friendships[22])
        expect((await Friendship.list({ offset: 10, limit: 10 })).docs[0].toJSON()).toEqual(friendships[12])
    });
});
