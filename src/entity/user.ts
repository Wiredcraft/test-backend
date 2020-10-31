import _ from 'lodash'
import { Entity, Column, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { bcryptCompareAsync, bcryptHashAsync } from '../utils/helpers'

@Entity()
export class User {
    @ObjectIdColumn()
    id!: ObjectID

    @Column({ length: 80 })
    name!: string

    @Column({ length: 100 })
    email!: string

    @Column('text')
    password!: string

    @Column()
    dob!: Date

    @Column()
    following!: Array<string>

    @Column()
    address!: string

    @Column()
    description!: string

    @Column()
    refreshToken!: string
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt?: Date

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
        id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        name: { type: 'string', minLength: 2, maxLength: 80, example: 'Emmanuel' },
        email: { type: 'string', format: 'email', example: 'emmanuel@test.com' },
        dob: { type: 'string', format: 'date', example: '1996-05-30' },
        password: { type: 'string', example: 'AAaa@@88$$99' },
        following: { type: 'array' },
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
