import type { HttpContext } from '@adonisjs/core/http'
import { CreateTestService } from '#services/test_creation_service'
import {
  createTestValidator,
  validateTestDates,
  validateQuestionsCount,
  validateUniqueQuestions,
} from '#validators/create_test_validator'
import { DateTime } from 'luxon'

export default class CreateTestController {
  private createTestService = new CreateTestService()

  public async create({ request, response}: HttpContext) {
    try {
    
      const data = await request.validateUsing(createTestValidator)

      // Convert date strings to DateTime objects
      const startsAt = DateTime.fromJSDate(data.starts_at)
      const endsAt = DateTime.fromJSDate(data.ends_at)

      validateTestDates(startsAt, endsAt)
      validateQuestionsCount(data.total_questions, data.questions_id)
      validateUniqueQuestions(data.questions_id)

      // Get authenticated admin user ID (replace with actual auth after setup)
      const createdBy =  1 // Fallback for now

      // Create test with all validations passed
      const createdTest = await this.createTestService.create({
        ...data,
        starts_at: startsAt,
        ends_at: endsAt,
        created_by: createdBy,
      })
      return response.created({
        message: 'Test created successfully',
        data: createdTest,
      })

    } catch (error) {

      if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }
      const message = error instanceof Error ? error.message : 'Failed to create test'
      
      return response.badRequest({
        message,
      })
    }
  }
}