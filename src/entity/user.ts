import _ from 'lodash'
import { Entity, Column, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { bcryptCompareAsync, bcryptHashAsync } from '../utils/helpers'

@Entity()
export class User {
    // id
    @ObjectIdColumn()
    id!: ObjectID

    // name
    @Column({ length: 80 })
    name!: string

    // email
    @Column({ length: 100 })
    email!: string

    // password
    @Column('text')
    password!: string

    // dob
    @Column()
    dob!: Date

    // address
    @Column()
    address!: string

    // description
    @Column()
    description!: string

    // refreshToken
    @Column()
    refreshToken!: string
    
    // createdAt
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date

    // updatedAt
    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt?: Date

    async hashPassword() {
        this.password = await bcryptHashAsync(this.password, 8)        
    }
    
    async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcryptCompareAsync(unencryptedPassword, this.password)
    }

    toJSON() {
        return _.omit(this, ['password', 'refreshToken'])
    }
}

export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$', example: '5f9261a4c4c2ef2d64acc988' },
        name: { type: 'string', minLength: 2, maxLength: 80, example: 'Emmanuel' },
        email: { type: 'string', format: 'email', example: 'emmanuel@test.com' },
        dob: { type: 'string', format: 'date', example: '1996-05-30' },
        password: { type: 'string', example: 'AAaa@@88$$99' },
        address: {
            type: 'string',
            minLength: 0,
            maxLength: 300,
            example: '44-65 Laparella Cinco, Donella, Mexico City, Mexico',
        },
        description: {
            type: 'string',
            minLength: 0,
            maxLength: 500,
            example: 'A versatile back-end node.js developer',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
    },
    additionalProperties: false,
}
