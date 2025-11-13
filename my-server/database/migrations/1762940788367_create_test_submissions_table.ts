import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('test_id')
        .unsigned()
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
      // e.g., "in_progress", "submitted", etc.
      table.integer('total_questions').notNullable()
      table.integer('correct_answers').defaultTo(0)
      table.integer('score').defaultTo(0)
      // Numeric score instead of just percentage
      table.decimal('percentage', 5, 2).nullable()
      table.string('grade', 5).nullable()
      table.boolean('is_submitted').defaultTo(false)
      // IP used to start the attempt
      table.timestamp('started_at').nullable()
      table.timestamp('submitted_at').nullable()

      // Ensure unique student per test (one attempt only)
      table.unique(['test_id', 'candidate_id'])
    })

    // Add composite foreign key constraints
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('test_id', 'fk_submission_test')
        .references('id')
        .inTable('tests')
        .onDelete('CASCADE')
      table
        .foreign('candidate_id', 'fk_submission_candidate')
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}