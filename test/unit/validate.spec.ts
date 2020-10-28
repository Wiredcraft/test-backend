import { expect } from 'chai'
import { validate, validatePassword, requiredProperties, isExpired} from '../../src/utils/validate'
import { userSchema } from '../../src/entity/user'

describe('fn: validate', () => {
    it('should validate an object based on a schema', async () => {
        const objToValidate = {
            name: 'Emmanuel',
            email: 'emmanuel@test.com',
            dob: '1996-05-30',
            password: 'AAaa@@88$$99',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        }

        const result = await validate(objToValidate, userSchema, [])

        expect(result).to.be.undefined
    })

    it('should fail to validate an object when a required prop is missing', async () => {
        const objToValidate = {
            name: 'Emmanuel',
            email: 'emmanuel@test.com',
            dob: '1996-05-30',
            address: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
            description: 'A versatile back-end node.js developer',
        }

        const result = await validate(objToValidate, userSchema, ['password'])
        expect(result).to.be.an('array')
        expect(result && result[0]?.params?.missingProperty).to.be.equal('password')
    })
})

describe('fn: validatePassword', () => {
    it('should validate a password based on common recommendations', () => {
        let validationResult = validatePassword('AA')
        expect(validationResult).to.be.equal('too_short')

        validationResult = validatePassword('AAasdasdasfsdfsdfsfsdvsvsdwefwefw324r3r2dewd23d2d23d2dadaxdcd32e2r24r2')
        expect(validationResult).to.be.equal('too_long')

        validationResult = validatePassword('AAasdasdasfsdfs')
        expect(validationResult).to.be.equal('missing_number')

        validationResult = validatePassword('asdasdas3232fsdfs')
        expect(validationResult).to.be.equal('missing_uppercase_char')

        validationResult = validatePassword('DKDJFH234H@##$EW@@')
        expect(validationResult).to.be.equal('missing_lowercase_char')

        validationResult = validatePassword('a3r33e23sdADAsd33fas')
        expect(validationResult).to.be.equal('missing_special_char')

        validationResult = validatePassword('ADAaa@@88$$99')
        expect(validationResult).to.be.equal('good')
    })
})

describe('fn: requiredProperties', () => {
    it('should return missing props on an object', () => {
        const obj = {
            name: 'James',
            age: 26,
            eye: 'blue'
        }
        let missingProperties = requiredProperties(obj, ['address'])

        expect(missingProperties.length).to.be.equal(1)
        expect(missingProperties[0]).to.be.equal('address')

        missingProperties = requiredProperties(obj, ['name', 'age', 'eye'])
        expect(missingProperties.length).to.be.equal(0)
    })
})

describe('fn: isExpired', () => {
    it('should return a boolean if a given unix timestamp is before or after current time', async () => {
        let isExpiredTime = isExpired(5000)

        expect(isExpiredTime).to.be.true

        isExpiredTime = isExpired(Math.floor(Date.now() /1000) + 5000)

        expect(isExpiredTime).to.be.false

    })
})