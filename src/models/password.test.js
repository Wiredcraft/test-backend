import mongoose from "mongoose";
import Password from "./password";
import { MONGODB_TEST_CONNECTION } from "../config";

const passwordSample = {
    user: "123456", // user id
    password: "admin", // login type("password", "github")
};
// generatePassword will produce data doc for tests
const generatePassword = properties => ({ ...passwordSample, ...properties });

describe("Password model", () => {
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
        const doc = generatePassword();
        const testPassword = await Password.create({
            ...doc,
        });
        expect(testPassword.toJSON()).toEqual(expect.objectContaining(doc));
    });

    it("should list passwords", async () => {
        const passwordCount = 10;
        const passwords = []
        for (let i = 0; i < passwordCount; i++) {
            const newPassword = await Password.create(generatePassword())
            passwords.push(newPassword.toJSON())
        }

        expect((await Password.list()).docs.length).toEqual(passwordCount);

        const passwordCount2 = 13;
        for (let i = 0; i < passwordCount2; i++) {
            const newPassword = await Password.create(generatePassword())
            passwords.push(newPassword.toJSON())
        }
        expect((await Password.list({ limit: 10000 })).docs.length).toEqual(passwords.length);
        expect((await Password.list({ limit: 10 })).docs.length).toEqual(10);
        expect((await Password.list({ limit: 10000 })).docs[0].toJSON()).toEqual(passwords[22])
        expect((await Password.list({ offset: 10, limit: 10 })).docs[0].toJSON()).toEqual(passwords[12])
    });
});
