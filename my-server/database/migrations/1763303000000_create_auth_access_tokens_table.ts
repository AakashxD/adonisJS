import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AuthAccessTokens extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  // No-op migration: the project already contains a migration that creates this table
  public async up() {
    // Intentionally left blank to avoid duplicate table creation
  }

  public async down() {
    // Intentionally left blank
  }
}
