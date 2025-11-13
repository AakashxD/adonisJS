import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidates_submitted_answers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('submission_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('test_submissions')
        .onDelete('CASCADE')
      table
        .integer('question_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('test_questions')
        // Changed from 'questions' to 'test_questions'
        .onDelete('CASCADE')
      table.boolean('is_correct').defaultTo(false)
      table.timestamp('answered_at').nullable()
    })

    // Add composite foreign key constraints
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('submission_id', 'fk_submission')
        .references('id')
        .inTable('test_submissions')
        .onDelete('CASCADE')
      table
        .foreign('question_id', 'fk_answer_question')
        .references('id')
        .inTable('test_questions')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}