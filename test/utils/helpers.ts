import { Db, ObjectID } from 'mongodb'

export async function clearTestDbUsers(db: Db | undefined): Promise<void> {
    if (!db) throw new Error('Error removing users from db')

    await db.collection('user').deleteMany({})
}

export async function printTestDbUsers(db: Db | undefined): Promise<void> {
    if (!db) throw new Error('Error printing users from db')

    console.log('USERS: ', await db.collection('user').find({}).toArray())
}

export async function getTestDbUser(db: Db | undefined, id: string): Promise<Record<string, any> | null> {
    if (!db) throw new Error('Error printing users from db')

    return db.collection('user').findOne({ _id: id })
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