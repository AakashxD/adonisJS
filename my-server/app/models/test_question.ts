import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Test from './tests.js'
import Question from './question.js'

export default class TestQuestion extends BaseModel {
  public static table = 'test_questions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare testId: string

  @column()
  declare questionId: number

  @column()
  declare questionOrder: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Relationships
  @belongsTo(() => Test, { foreignKey: 'testId' })
  declare test: BelongsTo<typeof Test>

  @belongsTo(() => Question, { foreignKey: 'questionId' })
  declare question: BelongsTo<typeof Question>
}