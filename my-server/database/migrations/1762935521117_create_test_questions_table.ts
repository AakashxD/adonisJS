import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_questions'

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
      table.text('question_text').nullable()
      table.string('question_image_url', 500).nullable()
      table.text('correct_option').checkIn(['A', 'B', 'C', 'D']).notNullable()
      // CHECK constraint for correct_option
      table.text('option_a').notNullable()
      table.text('option_b').notNullable()
      table.text('option_c').notNullable()
      table.text('option_d').notNullable()
      table.string('difficulty', 20).notNullable()
      table.integer('no_of_times_appeared').defaultTo(0)
      table.integer('no_of_times_correct').defaultTo(0)
      table
        .integer('created_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('admins')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })

    // Add composite foreign key constraints
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('test_id', 'fk_test').references('id').inTable('tests').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
  
 