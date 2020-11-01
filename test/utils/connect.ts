import { Db, MongoClient } from 'mongodb'
import { server } from '../../src/server'

// Connection URI
const databaseName = `testDb_${Math.floor(Math.random() * (Math.floor(999999) + 1))}`
const uri = 'mongodb://user:pass@localhost:27017/' + databaseName + '?authSource=admin'

export let mongoClient: MongoClient

// global db connection
let database: Db | undefined

export const mongo = {
    db: database,
    uri,
    async connect() {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(
            (error) => {
                console.log(error)
            },
        )

        if (!client) return

        mongoClient = client
        this.db = client.db(databaseName)

        return this.db 
    },
}

export const testServer = server()