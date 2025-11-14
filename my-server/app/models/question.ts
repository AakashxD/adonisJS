import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Admin from './admin.js'
import Test from './tests.js'
import CandidateSubmittedAnswer from './candidate_submitted_answer.js'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

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
  @belongsTo(() => Admin, { foreignKey: 'createdBy' })
  declare admin: BelongsTo<typeof Admin>

  // Many-to-Many: A question can be in many tests
  @manyToMany(() => Test, {
    pivotTable: 'test_questions',
    pivotForeignKey: 'question_id',
    pivotRelatedForeignKey: 'test_id',
    pivotColumns: ['question_order', 'created_at'],
  })
  declare tests: ManyToMany<typeof Test>

  @hasMany(() => CandidateSubmittedAnswer, { foreignKey: 'questionId' })
  declare submittedAnswers: HasMany<typeof CandidateSubmittedAnswer>
}