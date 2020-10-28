// import { expect } from 'chai'
import { bcryptCompareAsync } from '../../src/utils/helpers'

describe('fn: bcryptCompareAsync', () => {
    it('should compare two strings and return a promise', async () => {
        const result = await bcryptCompareAsync('stringA', 'stringA')
        console.log(result)
    })
})

// describe('fn: bcryptHashAsync', () => {
//     it('should validate a password based on common recommendations', async () => {

//     })
// })