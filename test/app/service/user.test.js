const { app, mock, assert } = require('egg-mock/bootstrap')

describe('get user test', () => {

    describe("create user", () => {
        it('create an user successfuly', async () => {
            const ctx = app.mockContext()
            const user = await ctx.service.user.create({ "basicInfo": { "name": "test_100", "dob": "2010-08-01", "address": "shanghai", "description": "good" } })

            assert(user)
            assert(user.code == 1)

            const id = user.data.id.toString()
            await ctx.model.User.findByIdAndDelete(id)
        })

        it('create an empty user will throw an error', async () => {
            const ctx = app.mockContext()
            try {
                const user = await ctx.service.user.create({})
            } catch (error) {
                assert(error)
            }
        })
    })

    describe("when user exists, then", () => {
        let ctx;
        let id;
        beforeEach(async () => {
            ctx = app.mockContext()
            const user = await ctx.service.user.create({ "basicInfo": { "name": "test_100", "dob": "2010-08-01", "address": "shanghai", "description": "good" } })
            assert(user)
            assert(user.code == 1)
            id = user.data.id.toString()
        })

        afterEach(async () => {
            await ctx.model.User.findByIdAndDelete(id)
        })

        it('find it', async () => {
            const foundUser = await ctx.service.user.findById({ id })

            assert(foundUser)
            assert(foundUser.code == 1)

            assert(foundUser.data.basicInfo.name === "test_100")
        })

        it('update its name', async () => {
            const updatedUser = await ctx.service.user.updateById({
                id: id, basicInfo: {
                    "name": "test_300", "dob": "2010-08-01", "address": "shanghai", "description": "good"
                }
            })

            assert(updatedUser)
            assert(updatedUser.code == 1)

            assert(updatedUser.data.basicInfo.name === "test_300")
        })

        it('mark it as removed', async () => {
            const removedUser = await ctx.service.user.markAsInvalid({ id })

            assert(removedUser)
            assert(removedUser.code == 1)

            assert(removedUser.data.valid === false)
        })
    })

    describe("when user doesn't exit, then", () => {
        it('update it, return code equals -1', async () => {
            const ctx = app.mockContext()

            const id = "5db4f9488085664a907067cc"
            const updatedUser = await ctx.service.user.updateById({
                id: id, basicInfo: {
                    "name": "test_300", "dob": "2010-08-01", "address": "shanghai", "description": "good"
                }
            })

            assert(updatedUser)
            assert(updatedUser.code == -1)
        })

        it('find it, return code equals -1', async () => {
            const ctx = app.mockContext()

            const id = "5db4f9488085664a907067cc"
            const updatedUser = await ctx.service.user.findById({ id })

            assert(updatedUser)
            assert(updatedUser.code == -1)
        })

        it('remove it, return code equals -1', async () => {
            const ctx = app.mockContext()

            const id = "5db4f9488085664a907067cc"
            const updatedUser = await ctx.service.user.markAsInvalid({ id })

            assert(updatedUser)
            assert(updatedUser.code == -1)
        })
    })
})
