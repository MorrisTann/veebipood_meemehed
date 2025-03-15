/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
      table.boolean("isVerified").notNullable().defaultTo(false);
      table.string("confirmationToken");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
      table.dropColumn("isVerified");
      table.dropColumn("confirmationToken");
    });
  };
  