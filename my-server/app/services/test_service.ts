import TestQuestion from '#models/test_question'
import Test from '#models/tests'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import db from '@adonisjs/lucid/services/db'
import { QuestionService } from '#services/question_service'
import { HttpContext } from '@adonisjs/core/http'
interface TestData {
  title: string
  description: string
  duration_minutes: number
  total_questions: number
  questions_id: number[]
  starts_at: DateTime
  ends_at: DateTime
  created_by?: number
}

export class TestService {
  private questionService = new QuestionService()

  async create(data: TestData): Promise<Test> {

    const trx = await db.transaction()

    try {

      await this.questionService.validateQuestionsExist(data.questions_id)

      // Generate unique test ID
      const testId: string = randomUUID()

      const test = await Test.create(
        {
          id: testId,
          title: data.title,
          description: data.description,
          durationMinutes: data.duration_minutes,
          status:'published',
          totalQuestions: data.total_questions,
          startsAt: data.starts_at,
          endsAt: data.ends_at,
          createdBy: data.created_by ?? null,
          isActive: true, 
        },
        { client: trx }
      )
      // Create test-question associations
      const testQuestions = data.questions_id.map((questionId: number, index: number) => ({
        testId: testId,
        questionId,
        questionOrder: index + 1,
      }))

      await TestQuestion.createMany(testQuestions, { client: trx })

      
      
      await trx.commit()

      return test;
    } catch (error) {
      // Rollback transaction on error
      await trx.rollback()

      console.error('Error creating test:', error)

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Failed to create test')
    }
  }

  async exists(testId: string):Promise<boolean> {
    const test = await Test.find(testId)

    if (!test) {
      return false;
    }

    return true;
  }

  
}
