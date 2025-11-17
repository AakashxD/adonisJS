import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_submissions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('answers').notNullable().alter()
      table.decimal('percentage', 5, 2).notNullable().defaultTo(0)
      table.integer('score').notNullable().defaultTo(0).alter()
      table.dropColumn('wrong_answers')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('percentage')
      table.decimal('score', 5, 2).defaultTo(0).alter()
      table.integer('wrong_answers').defaultTo(0)
      table.jsonb('answers')
    })
  }
}
