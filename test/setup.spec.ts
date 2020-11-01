import { mongo } from './utils/connect'
import { setupConnection } from './../src/utils/conn'
import { Db } from 'mongodb'

// global db connection
let database: Db | undefined

before(async function () {
    if(!mongo.db) database = await mongo.connect()
  
    if (database) await setupConnection(mongo.uri)
})

after(async function () {
    if (database) await database.dropDatabase()
})