import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title', 255).notNullable()
      table.text('description').nullable()
      table.string('status', 50).notNullable()
      table.integer('total_questions').notNullable()
      table.integer('duration_minutes').notNullable()
      table.timestamp('starts_at').nullable()
      table.timestamp('ends_at').nullable()
      table.integer('extra_hours').defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table
        .integer('created_by') // This is the column that will store the id of the admin who created the test.
        .unsigned()
        .nullable()
        .references('id')
        .inTable('admins')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}