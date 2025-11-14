import vine from '@vinejs/vine'
import { DateTime } from 'luxon'


export const createTestValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(200),
    description: vine.string().trim().minLength(10).maxLength(1000),
    duration_minutes: vine.number().min(5).max(300), // 5 mins to 5 hours
    total_questions: vine.number().min(1).max(100),
    questions_id: vine.array(vine.number().positive()).minLength(1).maxLength(100),
    starts_at: vine.date(),
    ends_at: vine.date(),
  })
)


export const validateTestDates = (startsAt: DateTime, endsAt: DateTime) => {
  const now = DateTime.now()
  
  // Check if starts_at is in the future
  if (startsAt < now) {
    throw new Error('Test start date must be in the future')
  }
  
  // Check if ends_at is after starts_at
  if (endsAt <= startsAt) {
    throw new Error('Test end date must be after start date')
  }
  
  // Check if test duration is reasonable (e.g., not more than 30 days)
  const durationInDays = endsAt.diff(startsAt, 'days').days
  if (durationInDays > 30) {
    throw new Error('Test duration cannot exceed 30 days')
  }
}

export const validateQuestionsCount = (totalQuestions: number, questionsIds: number[]) => {
  if (totalQuestions !== questionsIds.length) {
    throw new Error(
      `Total questions (${totalQuestions}) must match the number of question IDs provided (${questionsIds.length})`
    )
  }
}

export const validateUniqueQuestions = (questionsIds: number[]) => {
  const uniqueIds = new Set(questionsIds)
  if (uniqueIds.size !== questionsIds.length) {
    throw new Error('Duplicate question IDs are not allowed in a test')
  }
}