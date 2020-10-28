import { Connection, createConnection } from 'typeorm'
import { Tedis } from 'tedis'
import { config, Config } from './config'

let conn: Connection | null = null
/**
 * Connects to a TypeORM connected database
 * @param  {string} url
 * @param  {boolean=false} drop
 * @returns the database connection object
 */
export async function setupConnection(url: string, drop: boolean = false) {
    conn = await createConnection({
        type: 'mongodb',
        url,    
        useNewUrlParser: true,      
        ssl: config.dbsslconn,
        authSource: 'admin',
        keepAlive: 600000,
        w: 'majority',
        entities: config.dbEntitiesPath,
        synchronize: true,
        useUnifiedTopology: true,
        dropSchema: drop,
        logging: false,
    })

    return conn
}

/**
 * Connect to a redis db in Typescript
 * Redis can be used for many things (rate limit/ token tracking etc) so here's a connector
 * @param  {Config} config
 * @returns a Promise to a redis connection
 * 
 * @example
 * const tedis = await connectTedis(config)
 *  try { 
 *      await tedis.command('SET', 'key1', 'Hello') 
 *  } catch (err) { 
 *      console.error(err)
 *  }
 */
export const connectTedis = async (config: Config) => new Tedis(config.redis)