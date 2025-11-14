import type { HttpContext } from '@adonisjs/core/http'
import { TestService } from '#services/test_service'
import {
  createTestValidator,
  validateTestDates,
  validateQuestionsCount,
  validateUniqueQuestions,
} from '#validators/test_validator'
import { DateTime } from 'luxon'
import { QuestionService } from '#services/question_service'

export default class TestController {
  private TestService = new TestService()
  private QuestionService=new QuestionService();

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
      const createdTest = await this.TestService.create({
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
  public async getTestQuestions({request,response}:HttpContext){
       try {

        const { test_id } = request.only(['test_id'])
        const isValid:Boolean=await this.TestService.exists(test_id);
        if(!isValid){
          throw new Error('Invalid test Id')
        }

           const data = await this.QuestionService.getAlltestQuestions(test_id)

          return response.status(201).send(data);


       } catch (error) {
        if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }
      const message = error instanceof Error ? error.message : 'Failed to create test'
      
      return response.status(401).badRequest({
        message,
      })
        
       }
         
  }
  public async submissionTest({request}:HttpContext){
       
  }
  

}