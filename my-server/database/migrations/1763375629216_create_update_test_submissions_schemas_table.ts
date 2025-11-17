import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_submissions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // make sure answers is jsonb
      // If it is already jsonb, you can skip this line.
      table.jsonb('answers').notNullable().alter()

      
      table.string('ip_address', 45).notNullable() // ipv4/ipv6

 
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Rollback (remove only if you actually added in up())

      table.dropColumn('ip_address')
     
    })
  }
}
