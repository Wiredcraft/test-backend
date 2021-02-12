import knex from "./utils/db";
import app from './app';

// should be done somewhere else like a migration service
// put it here for simplicity :P
(knex.schema.hasTable("user")
.then(function (exists) {
  if (!exists) {
    return knex.schema.createTable("user", function (t) {
      t.increments("id").primary();
      t.string("name", 255).notNullable().unique().index();
      t.string('password').notNullable();
      t.date("date_of_birth");
      t.string("address");
      t.string("description");
      t.timestamp("deactivated_at", { useTz: true});
      t.timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      t.timestamp("updated_at", {useTz: true})
    });
  }
})).catch(console.warn);
(knex.schema.hasTable("user_mapping")
.then(function (exists) {
  if (!exists) {
    return knex.schema.createTable("user_mapping", function (t) {
      t.increments("id").primary();
      t.integer('user_id').notNullable();
      t.integer('follower_id').notNullable();
      t.timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }
})).catch(console.warn)

app.on('error', console.error);
app.listen(3000, () => {
  console.log('Server listening on port 3000')
});
