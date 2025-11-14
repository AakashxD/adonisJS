import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Test from './tests.js'
import Question from './question.js'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null }) // Hide password from JSON responses
  declare passwordHash: string

  @column()
  declare role: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Relationships
  @hasMany(() => Test, { foreignKey: 'createdBy' })
  declare tests: HasMany<typeof Test>

  @hasMany(() => Question, { foreignKey: 'createdBy' })
  declare questions: HasMany<typeof Question>
}