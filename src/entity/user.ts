import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm'
import { Length, IsEmail, IsDate } from 'class-validator'

@Entity()
export class User {
    // id

    // for postgres
    // @PrimaryGeneratedColumn("uuid")
    // id!: string;

    // for mongodb
    @ObjectIdColumn()
    id!: ObjectID

    // name
    @Column({ length: 80 })
    @Length(2, 80)
    name!: string

    // email
    @Column({ length: 100 })
    @Length(1, 100)
    @IsEmail()
    email!: string

    // dob
    @Column()
    @IsDate()
    dob!: Date

    // address
    @Length(0, 300)
    address!: string

    // description
    @Length(0, 500)
    description!: string

    // createdAt
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date

    // updatedAt
    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
    updatedAt!: Date
}

export const userSchema = {
    id: { type: 'number', required: true, example: '5f9261a4c4c2ef2d64acc988' },
    name: { type: 'string', required: true, example: 'Emmanuel' },
    email: { type: 'string', required: true, example: 'emmanuel@test.com' },
    dob: { type: 'date', required: true, example: '1996-5-30' },
    address: { type: 'string', required: false, example: '44-65 Laparella Cinco, Donella, Mexico City, Mexico' },
    description: { type: 'string', required: false, example: 'A versatile back-end node.js developer' },
}
