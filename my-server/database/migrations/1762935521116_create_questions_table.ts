import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'questions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('question_text').nullable()
      table.string('question_image_url', 500).nullable()
      table.boolean('is_option_image').notNullable()
      table
        .enum('correct_option', ['A', 'B', 'C', 'D'])
        .notNullable()
        .checkIn(['A', 'B', 'C', 'D'])
      table.text('option_a').notNullable()
      table.text('option_b').notNullable()
      table.text('option_c').notNullable()
      table.text('option_d').notNullable()
      table.string('difficulty', 20).notNullable()
      table.integer('no_of_times_appeared')
      table.integer('no_of_times_correct')
      table
        .integer('created_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('admins')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}