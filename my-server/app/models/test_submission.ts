import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Test from './tests.js'
import Candidate from './candidate.js'
import CandidateSubmittedAnswer from './candidate_submitted_answer.js'

export default class TestSubmission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare testId: number

  @column()
  declare candidateId: number

  @column()
  declare status: string

  @column()
  declare totalQuestions: number

  @column()
  declare correctAnswers: number

  @column()
  declare score: number

  @column()
  declare percentage: number | null

  @column()
  declare grade: string | null

  @column()
  declare isSubmitted: boolean

  @column.dateTime()
  declare startedAt: DateTime | null

  @column.dateTime()
  declare submittedAt: DateTime | null

  // Relationships
  @belongsTo(() => Test, { foreignKey: 'testId' })
  declare test: BelongsTo<typeof Test>

  @belongsTo(() => Candidate, { foreignKey: 'candidateId' })
  declare candidate: BelongsTo<typeof Candidate>

  @hasMany(() => CandidateSubmittedAnswer, { foreignKey: 'submissionId' })
  declare submittedAnswers: HasMany<typeof CandidateSubmittedAnswer>
}