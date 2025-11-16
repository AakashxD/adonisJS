import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('test_id')
        .notNullable()
        .references('id')
        .inTable('tests')
        .onDelete('CASCADE')
      table
        .integer('question_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('questions')
        .onDelete('CASCADE')
      table.integer('question_order').nullable() // Optional: to maintain question order in test
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      // Prevent duplicate question in same test
      table.unique(['test_id', 'question_id'], 'unique_test_question')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}