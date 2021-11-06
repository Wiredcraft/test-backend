import { PoolClient } from 'pg';
import { Migration } from '..';

export const migration:Migration = {
    migrate: async (c:PoolClient) => {
        await c.query(
            `
                create table "user" (
                    id serial primary key,
                    name text not null unique,
                    dob timestamptz,
                    address text,
                    description text,
                    created_at timestamptz default current_timestamp,
                    latitude int4,
                    longitude int4,
                    ip int4
                );
                create index "user_lat_idx" ON "user" ("latitude");
                create index "user_long_idx" ON "user" ("longitude");
            `,
        );
    },
    name: 'init project',
};
