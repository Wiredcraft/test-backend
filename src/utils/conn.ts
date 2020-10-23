import { Connection, createConnection } from 'typeorm'
import { config } from './config'

let conn: Connection | null = null

export async function setupConnection(url: string, drop: boolean = false) {
    conn = await createConnection({
        type: 'mongodb',
        url,    
        useNewUrlParser: true,      
        ssl: config.dbsslconn,
        authSource: 'admin',
        w: 'majority',
        entities: config.dbEntitiesPath,
        synchronize: true,
        useUnifiedTopology: true,
        dropSchema: drop,
        logging: false,
    })

    return conn
}
