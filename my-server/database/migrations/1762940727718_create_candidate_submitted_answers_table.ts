import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidates_submitted_answers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      // Keep columns but avoid adding foreign key constraints here to prevent ordering issues
      table.integer('submission_id').unsigned().notNullable()
      table.integer('question_id').unsigned().notNullable()
      table.boolean('is_correct').defaultTo(false)
      table.timestamp('answered_at').nullable()

      // One answer per question per submission
      table.unique(['submission_id', 'question_id'], 'unique_submission_question_answer')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}