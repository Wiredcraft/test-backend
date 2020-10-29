// eslint-disable-next-line @typescript-eslint/no-var-requires
const phonetic = require('phonetic')
import { Db, ObjectID } from 'mongodb'
import jwt from 'jsonwebtoken'
import { config } from '../../src/utils/config'

export async function clearTestDbUsers(db: Db | undefined): Promise<void> {
    if (!db) throw new Error('Error removing users from db')

    await db.collection('user').deleteMany({})
}

export async function printTestDbUsers(db: Db | undefined): Promise<void> {
    if (!db) throw new Error('Error printing users from db')

    console.log('USERS: ', db.databaseName, await db.collection('user').find({}).toArray())
}

export async function getTestDbUser(db: Db | undefined, id: string): Promise<Record<string, any> | null> {
    if (!db) throw new Error('Error printing users from db')
    
    return db.collection('user').findOne({ _id: new ObjectID(id) })
}

export async function deleteTestDbUser(db: Db | undefined, email: string): Promise<Record<string, any> | null> {
    if (!db) throw new Error('Error printing users from db')

    return db.collection('user').deleteOne({ email: email })
}

export async function deleteTestDbUsers(db: Db | undefined, userIds: Array<string>): Promise<Record<string, any> | null> {
    if (!db) throw new Error('Error printing users from db')

    const res = await db.collection('user').deleteMany({ _id: { $in: userIds.map(id => new ObjectID(id)) }})

    return res
}

export async function insertTestDbUsers(db: Db | undefined, userArr: Array<Record<string, any>>): Promise<void> {
    if (!db) throw new Error('Error inserting users from db')

    await db
        .collection('user')
        .insertMany(userArr.map((doc) => ({ 
            ...doc, 
            _id: new ObjectID(doc._id), 
            dob: new Date(doc.dob), 
            createdAt: new Date(doc.createdAt), 
            updatedAt: new Date(doc.updatedAt), 
        })))
}

export async function generateDatabaseUsers(db: Db | undefined, num: number): Promise<Array<any>>  {
    // this.password = await bcryptHashAsync(this.password, 8)  
    const newUsers = new Array(num).fill({}).map(() => {
        const name = (phonetic.generate({ syllables: 2 })).toLowerCase()

        return {
            _id: new ObjectID().toString(),
            name: `${name}`,
            email: `${name}@test.com`,
            password: '$2a$08$27vmuzkKBYwue2kxDaHtGOOY41o/Ju8qVomNRbNQjUYoGV.BeKJ2e',
            dob: '1996-05-29T00:00:00.000Z',
            address: 'some random address',
            description: 'some random description',
            refreshToken: jwt.sign({ email: `${name}@test.com` }, config.jwt.refreshTokenSecret, {
                expiresIn: config.jwt.refreshTokenLife,
            }),
            createdAt: '2020-10-29T01:51:27.838Z',
            updatedAt: '2020-10-29T01:51:27.838Z',
        }
    })

    // insert users
    await insertTestDbUsers(db, newUsers)

    return newUsers
}
