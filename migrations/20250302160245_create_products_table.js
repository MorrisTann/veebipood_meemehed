/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.decimal("price", 10, 2).notNullable().defaultTo(6.50);
    table.integer("stock").notNullable().defaultTo(100);
    table.string("image_name").notNullable();
    // Uued väljad:
    table.text("ingredients");          // Koostisosad
    table.text("suitable_uses");          // Milleks sobib toode
    table.string("best_before");          // Parim enne (tekstina või kuupäevana, kui vaja)
    table.integer("net_weight");          // Netokaal (grammides)
    table.text("allergens");              // Allergeenid
    table.decimal("price_per_100g", 10, 2); // Hind 100g kohta
    // Kasutame JSONB, kui kasutad PostgreSQL-i; muidu võid kasutada table.json() vastavalt andmebaasile.
    table.jsonb("nutrition");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
