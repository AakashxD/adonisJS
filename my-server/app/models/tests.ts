import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Admin from './admin.js'
import Question from './question.js'
import TestSubmission from './test_submission.js'

export default class Test extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: string

  @column({columnName:'total_questions'})
  declare totalQuestions: number

  @column({columnName:'durations_minutes'})
  declare durationMinutes: number

  @column.dateTime({columnName:'starts_at'})
  declare startsAt: DateTime | null

  @column.dateTime({columnName:'ends_at'})
  declare endsAt: DateTime | null

  @column({columnName:'is_options_image'})
  declare isOptionsImage:boolean

  @column({columnName:'extra_hours'})
  declare extraHours: number

  @column({columnName:'is_active'})
  declare isActive: boolean

  @column({columnName:'created_by'})
  declare createdBy: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Relationships
  @belongsTo(() => Admin, { foreignKey: 'createdBy' })
  declare admin: BelongsTo<typeof Admin>

  @manyToMany(() => Question, {
    pivotTable: 'test_questions',
    pivotForeignKey: 'test_id',
    pivotRelatedForeignKey: 'question_id',
  })
  declare questions: ManyToMany<typeof Question>

  @hasMany(() => TestSubmission, { foreignKey: 'testId' })
  declare submissions: HasMany<typeof TestSubmission>
}