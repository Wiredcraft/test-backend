import { Client, Pool, PoolClient } from 'pg';
import { Logger } from 'log4js';
import { PhysicalTable } from './schema';
import { App } from '../entry/app';

export type DbConfig = {
    host: string,
    port: number,
    user: string,
    database: string,
    password: string,
}

export type Tables = PhysicalTable//&View
export type All = { [name in keyof Tables]: Tables[name] };
export type NullPartial<T> = { [K in keyof T]?:T[K] | null};

export class Database {
    private pool:Pool|undefined;
    private logger:Logger;
    constructor(public app:App) {
        this.logger = this.app.loggers.getLogger('DB');
    }

    public init = async (dbConfig?: DbConfig):Promise<void> => {
        if (!dbConfig) {
            dbConfig = {
                host: this.app.config.dbHost,
                port: this.app.config.dbPort,
                user: this.app.config.dbUser,
                password: this.app.config.dbPass,
                database: this.app.config.dbDatabase,
            };
        }
        if (this.pool) { return; }
        this.logger.info('Db initing');
        try {
            const c = new Client(Object.assign({}, dbConfig, {
                database: 'postgres',
            }));
            try {
                this.logger.info('Connecting Postgres');
                await c.connect();
                this.logger.info('Connected');
            } catch (e) {
                this.logger.error('Unable to connect to Postgres');
                throw e;
            }
            if (this.app.config.env === 'test') {
                this.logger.info(`Test process, dropping test database`);
                try {
                    await c.query(`drop database ${dbConfig.database} with (force);`);
                    this.logger.info(`Dropped`);
                } catch (e) {
                    this.logger.debug(e);
                }
            }
            const r = await c.query('select * from pg_catalog.pg_database where datname = $1;', [dbConfig.database]);
            if (r.rowCount === 0) {
                this.logger.warn(`No target database detected, creating ${dbConfig.database}`);
                await c.query(`create database "${dbConfig.database}";`);
                this.logger.warn('Target database created');
            } else {
                this.logger.info('Target database found');
            }
            await c.end();
        } catch (e) {
            this.logger.error('Error while setting up initial connection to database');
            this.logger.error(e);
            throw e;
        }
        try {
            this.pool = new Pool(dbConfig);
        } catch (e) {
            this.logger.error('Error while setting up connection pool to database');
            this.logger.error(e);
            throw e;
        }
        this.logger.info('Db inited');
    }

    public query:Pool['query'] = <any>(async (...args:any[]) => {
        if (!this.pool) {
            throw new Error('db not inited');
        }
        this.logger.debug(args);
        return this.pool.query.apply(this.pool, <any>args);
    });

    public transact = async (f: (c:PoolClient) => Promise<void>):Promise<Error|undefined> => {
        if (!this.pool) {
            throw new Error('db not inited');
        }
        const c = await this.pool.connect();
        try {
            await c.query('begin');
            await f(c);
            await c.query('commit');
            return undefined;
        } catch (e) {
            await c.query('rollback');
            return e as Error;
        } finally {
            c.release();
        }
    };

    public close = async ():Promise<void> => {
        if (!this.pool) {
            return;
        }
        await this.pool.end();
    }

    public c = async <T extends keyof PhysicalTable> (
        tableName:T,
        data:NullPartial<Tables[T]>,
        conflict = '',
    ) : Promise<All[T] | undefined> => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const { rows } = await this.query(
            `
                insert into "${tableName}"
                    (${keys.map((key) => key).join(',')})
                values (${values.map((_, i) => `$${i + 1}`).join(',')})
                    ${conflict} returning *;
            `,
            values,
        );
        return rows[0];
    }

    public r = async <T extends keyof PhysicalTable, S extends keyof All[T]> (
        tableName:T,
        selects:S[],
        condition:Partial<All[T]>,
    ) : Promise<Pick<All[T], S> | undefined> => {
        for (const key in condition) {
            if (typeof condition[key] === 'undefined') {
                delete condition[key];
            }
        }
        const keys = Object.keys(condition);
        const values = Object.values(condition);
        const { rows } = await this.query(
            `
                select ${selects.length !== 0 ? selects.join(',') : '*'}
                    from "${tableName}"
                    where ${keys.map((key, i) => `${key} = $${i + 1}`).join(' and ')}
                    limit 1;
            `,
            values,
        );
        return rows[0];
    }

    public u = async <T extends keyof PhysicalTable> (
        tableName:T,
        updates:Partial<All[T]>,
        condition:Partial<All[T]>,
    ) : Promise<All[T][]> => {
        if (!condition) {
            throw new Error('Can not update without where clause in crud mode');
        }
        for (const key in updates) {
            if (typeof updates[key] === 'undefined') {
                delete updates[key];
            }
        }
        const updateKeys = Object.keys(updates);
        const updateValues = Object.values(updates);
        const conditionKeys = Object.keys(condition);
        const conditionValues = Object.values(condition);
        const values = updateValues.concat(conditionValues);
        const query = `
            update "${tableName}"
                set ${updateKeys.map((key, i) => `${key}=$${i + 1}`).join(',')}
            where
                ${conditionKeys.map((key, i) => `${key}=$${updateValues.length + 1 + i}`).join(' and ')}
            returning *;
        `;
        const { rows } = await this.query(query, values);
        return rows;
    }

    public d = async <T extends keyof PhysicalTable> (
        tableName:T,
        condition:Partial<All[T]>,
    ):Promise<boolean> => {
        if (!condition) {
            throw new Error('Can not delete without where clause in crud mode');
        }
        const keys = Object.keys(condition);
        const values = Object.values(condition);
        const { rows } = await this.query(
            `
                delete from "${tableName}"
                    where ${keys.map((key, i) => `${key} = $${i + 1}`).join(' and ')}
                returning *;
            `,
            values,
        );
        return !!rows[0];
    }
}
