import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import Test from './tests.js'
import Question from './question.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class Admin extends BaseModel {
  static accessTokens = DbAccessTokensProvider.forModel(Admin)
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null }) 
  declare passwordHash: string

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  

  @beforeSave()
  static async hashPassword(admin: Admin) {
    if (admin.$dirty.passwordHash) {
      admin.passwordHash = await hash.make(admin.passwordHash)
    }
  }

  // Relationships
  @hasMany(() => Test, { foreignKey: 'createdBy' })
  declare tests: HasMany<typeof Test>

  @hasMany(() => Question, { foreignKey: 'createdBy' })
  declare questions: HasMany<typeof Question>
}