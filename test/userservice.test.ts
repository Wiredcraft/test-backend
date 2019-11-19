import { expect } from 'chai'
import userService from '../service/user.service'

describe('service.user:', () => {
    it('should create user', async () => {
        const user = await userService.cryptPwdAndCreateUser({
            name: 'Tom',
            age: 76,
            dob: '2019-09-08',
            password: '123'
        })
        // expect(user._id).is.not.null
        // expect(user.name).eq('Tom')
        // expect(user.age).eq(76)
    })
})
