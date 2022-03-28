import supertest from "supertest"
import {app} from "../../../../app"
import {UserModel} from "../model";
import dayjs from "dayjs";
import {createRouteParams, patchRouteParams, updateRouteParams} from "../validator";
import {string} from "joi";


const server = app.callback()
const request: supertest.SuperTest<supertest.Test> = supertest(server)


beforeAll(() => {
    // TODO create fixtures here
})

afterAll(() => {
    // TODO remove fixtures here
})

describe("/user routes", () => {

    it("should return 200 and the user profile", async () => {
        const userId = "FAKE_USER_ID"
        const res = await request
            .get(`/v1/user/${userId}`)
            .send()

        expect(res.statusCode).toEqual(200)
        const user = JSON.parse(res.text) as UserModel

        expect(typeof user.name).toBe('string')
        expect(typeof user.dateOfBirth).toBe('string')
        expect(dayjs(user.dateOfBirth).isBefore(dayjs())).toBe(true)
        expect(typeof user.description).toBe('string')
        expect(typeof user.address).toBe('string')
    })

    it("should return 200 and all user profiles", async () => {
        const res = await request
            .get(`/v1/user`)
            .send()

        expect(res.statusCode).toEqual(200)
        const body = JSON.parse(res.text) as UserModel[]
        expect(body.length).toBeGreaterThan(0)

        for (const user of body) {
            expect(typeof user.name).toBe('string')
            expect(typeof user.dateOfBirth).toBe('string')
            expect(dayjs(user.dateOfBirth).isBefore(dayjs())).toBe(true)
            expect(typeof user.description).toBe('string')
            expect(typeof user.address).toBe('string')
        }
    })

    it("should return 200 and create a user profile", async () => {
        const body: createRouteParams = {
            name: "Fake User",
            dateOfBirth: "06-14-1994",
            address: "This is an address",
            description: "This is a description",
        }
        const res = await request
            .post(`/v1/user`)
            .send(body)

        expect(res.statusCode).toEqual(200)
        const response = JSON.parse(res.text) as UserModel
        expect(response.dateOfBirth).toBe(body.dateOfBirth)
        expect(response.id).toBeDefined()
        expect(response.name).toBe(body.name)
        expect(response.address).toBe(body.address)
        expect(response.description).toBe(body.description)
    })

    it("should return 200 and update a user profile", async () => {
        const body: updateRouteParams = {
            name: "Fake User",
            dateOfBirth: "06-14-1994",
            address: "This is an address",
            description: "This is a description",
        }
        const res = await request
            .put(`/v1/user/FAKE_USER_ID`)
            .send(body)

        expect(res.statusCode).toEqual(200)
        const response = JSON.parse(res.text) as UserModel
        expect(response.dateOfBirth).toBe(body.dateOfBirth)
        expect(response.name).toBe(body.name)
        expect(response.address).toBe(body.address)
        expect(response.description).toBe(body.description)
    })

    it("should return 200 and delete a user profile", async () => {
        const res = await request
            .del(`/v1/user/FAKE_USER_ID`)
            .send()

        expect(res.statusCode).toEqual(200)
    })

    it("should return 200 and patch a user profile", async () => {
        const body: patchRouteParams = {
            name: "Fake User",
            dateOfBirth: "06-14-1994",
            address: "This is an address",
            description: "This is a description",
        }
        const res = await request
            .patch(`/v1/user/FAKE_USER_ID`)
            .send(body)

        expect(res.statusCode).toEqual(200)
        const response = JSON.parse(res.text) as UserModel
        expect(response.dateOfBirth).toBe(body.dateOfBirth)
        expect(response.name).toBe(body.name)
        expect(response.address).toBe(body.address)
        expect(response.description).toBe(body.description)
    })
})
