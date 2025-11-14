import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import TestSubmission from './test_submission.js'

export default class Candidate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare rollNumber: string

  @column()
  declare collegeName: string

  @column()
  declare ipAddress: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasMany(() => TestSubmission, { foreignKey: 'candidateId' })
  declare submissions: HasMany<typeof TestSubmission>
}