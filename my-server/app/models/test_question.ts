import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Test from './tests.js'
import Admin from './admin.js'
import CandidateSubmittedAnswer from './candidate_submitted_answer.js'

export default class TestQuestion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare testId: number

  @column()
  declare questionText: string | null

  @column()
  declare questionImageUrl: string | null

  @column()
  declare correctOption: 'A' | 'B' | 'C' | 'D'

  @column()
  declare optionA: string

  @column()
  declare optionB: string

  @column()
  declare optionC: string

  @column()
  declare optionD: string

  @column()
  declare difficulty: string

  @column()
  declare noOfTimesAppeared: number

  @column()
  declare noOfTimesCorrect: number

  @column()
  declare createdBy: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Relationships
  @belongsTo(() => Test, { foreignKey: 'testId' })
  declare test: BelongsTo<typeof Test>

  @belongsTo(() => Admin, { foreignKey: 'createdBy' })
  declare admin: BelongsTo<typeof Admin>

  @hasMany(() => CandidateSubmittedAnswer, { foreignKey: 'questionId' })
  declare submittedAnswers: HasMany<typeof CandidateSubmittedAnswer>
}