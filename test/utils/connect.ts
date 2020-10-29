import { MongoClient } from 'mongodb'
import { server } from '../../src/server'

// Connection URI
const dbName = `testDb_${Math.floor(Math.random() * (Math.floor(999999) + 1))}`
const uri = 'mongodb://user:pass@localhost:27017/' + dbName + '?authSource=admin'

export let mongoClient: MongoClient

export const mongo = {
    uri,
    async connect() {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch(
            (err) => {
                console.log(err)
            },
        )

        if (!client) return

        mongoClient = client
        return client.db(dbName)
    },
}

export const testServer = server()