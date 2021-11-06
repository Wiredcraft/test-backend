import { Database } from '../pg';
import { PoolClient } from 'pg';
import { Logger } from 'log4js';
import fs from 'fs';
import path from 'path';

export type Migration = {
    migrate: (c:PoolClient) => Promise<void>,
    name: string,
};

const importMigrations = () => {
    return [
        import('./2021/init'),
    ];
};

const getTables = async (c:Database) => {
    return (await c.query(
        `
            select
                table_name,
                table_type
            from
                information_schema.tables
            where
                table_schema = 'public';
        `,
    )).rows;
};

const getColumns = async (c:Database, tableName:string) => {
    return (await c.query(
        `
            select
                table_name,
                column_name,
                data_type,
                is_nullable
            from
                information_schema.columns
            where
                table_name = $1;
        `,
        [tableName],
    )).rows;
};

export const generateSchemaType = async (c:Database):Promise<void> => {
    const map = {
        'integer': 'number',
        'timestamp with time zone': 'Date',
        'text': 'string',
    };
    const templateHead = `// this file is managed by migration process, you don't need to touch this.
export interface PhysicalTable {\n`;
    const templateTail = '}\n';
    let schema = '';
    schema += templateHead;
    const tables = await getTables(c);
    for (const table of tables) {
        const tableHead = `    '${table.table_name}': {\n`;
        const tableTail = '    }\n';
        schema += tableHead;
        const columns = await getColumns(c, table.table_name);
        for (const column of columns) {
            schema += `        ${column.column_name}${column.is_nullable === 'YES' ? '?' : ''}: ${map[column.data_type]};\n`;
        }
        schema += tableTail;
    }
    schema += templateTail;
    await new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(__dirname, '..', 'schema', 'index.ts'), schema, (e) => {
            if (e) {
                reject(e);
            } else {
                resolve(0);
            }
        });
    });
};

export const runMigrations = async (c:Database, logger:Logger):Promise<void> => {
    logger.info('Migration started');
    const tables = await getTables(c);
    let inited = false;
    for (const table of tables) {
        if (table.table_name === 'migration') {
            inited = true;
            break;
        }
    }
    if (!inited) {
        logger.info('Migration not found, start init process');
        await c.query(
            `
                create table "migration" (
                    id serial primary key,
                    name text unique
                );
            `
        );
        logger.info('Migration inited');
    }
    const migrations = (await Promise.all(importMigrations())).map((i) => {
        return i.migration;
    });
    const existedMigrations = (await c.query(
        `
            select name from "migration";
        `,
    )).rows.map((row) => {
        return row.name;
    });

    const err = await c.transact(async (c) => {
        for (const migration of migrations) {
            if (!existedMigrations.includes(migration.name)) {
                logger.info(`Migrating ${migration.name}`);
                await migration.migrate(c);
                await c.query('insert into "migration" (name) values ($1)', [migration.name]);
            } else {
                logger.info(`Skip existed migration ${migration.name}`);
            }
        }
    });
    logger.info('Migration done');
    if (err) {
        throw new Error(`Migration failed: ${err.message} ${err.stack}`);
    }
    logger.info('Updating schema');
    await generateSchemaType(c);
    logger.info('Updated');
};
