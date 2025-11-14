import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TestSubmission from './test_submission.js'
import Question from './question.js'

export default class CandidateSubmittedAnswer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare submissionId: number

  @column()
  declare questionId: number

  @column()
  declare isCorrect: boolean

  @column.dateTime()
  declare answeredAt: DateTime | null

  // Relationships
  @belongsTo(() => TestSubmission, { foreignKey: 'submissionId' })
  declare submission: BelongsTo<typeof TestSubmission>

  @belongsTo(() => Question, { foreignKey: 'questionId' })
  declare question: BelongsTo<typeof Question>
}