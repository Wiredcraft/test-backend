import { PoolClient } from 'pg';
import { Migration } from '..';

export const migration:Migration = {
    migrate: async (c:PoolClient) => {
        await c.query(
            `
                create table "oauth_github" (
                    id serial primary key,
                    node_id text not null,
                    user_id int4 not null,
                    created_at timestamptz default current_timestamp
                );
            `,
        );
    },
    name: 'connect github users to my users',
};
