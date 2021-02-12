import knex from "./utils/db";
(knex.schema.hasTable("users")
.then(function (exists) {
  if (!exists) {
    return knex.schema.createTable("users", function (t) {
      t.increments("id").primary();
      t.string("name", 255);
      t.date("date_of_birth");
      t.string("address");
      t.string("description");
      t.timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      t.timestamp("updated_at", {useTz: true})
    });
  }
})).catch(console.warn);