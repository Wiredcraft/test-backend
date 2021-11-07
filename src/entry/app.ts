import http from 'http';
import { Config, config } from '../config';
import { Log4js, Logger } from 'log4js';
import { initSpec } from '../logger';
import { runMigrations } from '../db/migration';
import { Database } from '../db/pg';
import { Service } from '../service';
import { getHttpHandler, Router } from '../router';
import Redis from 'ioredis';

export class App {
    public loggers:Log4js;
    public server:http.Server|undefined;
    public db:Database|undefined;
    public service:Service|undefined;
    public router:Router|undefined;
    public appLogger:Logger;
    public redis:Redis.Redis|undefined;
    private inited = false;
    constructor(public config:Config) {
        this.loggers = initSpec();
        this.appLogger = this.loggers.getLogger('APP');
        this.appLogger.level = this.config.logLevel;
    }
    public init = async ():Promise<void> => {
        if (this.inited) {
            return;
        }
        this.inited = true;
        this.appLogger.info('App initing');
        const dbLogger = this.loggers.getLogger('DB');
        dbLogger.level = this.config.logLevel;
        this.db = new Database(this);
        await this.db.init();
        this.service = new Service(this);
        this.router = new Router(this);
        this.redis = new Redis({
            port: this.config.redisPort,
            host: this.config.redisHost,
            password: this.config.redisPass,
        });
        // await this.redis.connect();
    };
    public start = async ():Promise<void> => {
        if (this.inited === false) {
            await this.init();
        }
        this.server = http.createServer(await getHttpHandler(this.router!)).listen(this.config.port);
        this.appLogger.info(`App start at http://${this.config.origin}:${this.config.port}\n` + 
        `Try http://${this.config.origin}:${this.config.port}/ping to test connection`);
    };
    public migrate = async ():Promise<void> => {
        if (this.inited === false) {
            await this.init();
        }
        const migrationLogger = this.loggers.getLogger('Migration');
        migrationLogger.level = this.config.logLevel;
        await runMigrations(this.db!, migrationLogger);
        await this.db!.close();
    };
    public test = async ():Promise<void> => {
        if (this.inited === false) {
            this.config.env = 'test';
            this.config.dbDatabase = 'test';
            await this.init();
            const migrationLogger = this.loggers.getLogger('TestMigration');
            migrationLogger.level = this.config.logLevel;
            await runMigrations(this.db!, migrationLogger);
        }
        this.appLogger.info('Test app inited');
    };
    public close = async ():Promise<void> => {
        this.server && this.server.close();
        this.db && this.db.close();
    };
}

export const run = async ():Promise<void> => {
    const { argv } = process;
    const option = argv[2] || '--start';
    if (!option.startsWith('--')) {
        throw new Error('wrong command, run `npm run dev --help for details `');
    }
    switch (option.slice(2)) {
    case 'help': {
        console.log('Nah, i\'m kidding, you should read readme.md first');
        break;
    }
    case 'migrate': {
        const app = new App(config);
        await app.migrate();
        process.exit(0);
        break;
    }
    case 'start': {
        const app = new App(config);
        await app.start();
        break;
    }
    default: {
        throw new Error('unknown command, run `npm run dev --help for details `');
    }
    }
};
