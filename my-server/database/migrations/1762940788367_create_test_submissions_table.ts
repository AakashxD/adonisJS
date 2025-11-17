import { BaseSchema } from '@adonisjs/lucid/schema'
import { DateTime } from 'luxon';

export default class extends BaseSchema {
  protected tableName = 'test_submissions'

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
        .integer('candidate_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')
      table.string('status', 20).notNullable()
      table.jsonb('answers')
      table.integer('total_questions').notNullable()
      table.integer('correct_answers').defaultTo(0)
      table.integer('wrong_answers').defaultTo(0)
      table.decimal('score', 5, 2).defaultTo(0)
      table.specificType('ip_address', 'inet').notNullable()
      table.timestamp('started_at').nullable()
      table.timestamp('submitted_at').nullable()

      // ONE ATTEMPT PER TEST RULE
      table.unique(['test_id', 'candidate_id'], 'unique_candidate_test_attempt')
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}