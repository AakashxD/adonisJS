import type { HttpContext } from '@adonisjs/core/http'
import { TestService } from '#services/test_service'
import {
  createTestValidator,
  validateTestDates,
  validateQuestionsCount,
  validateUniqueQuestions,
} from '#validators/test_validator'
import { TestsubmissionValidator } from '#validators/test_submission_validator'
import { DateTime } from 'luxon'
import { QuestionService } from '#services/question_service'
export default class TestController {
  private TestService = new TestService()
  private QuestionService=new QuestionService();

  public async create({ request, response,auth}: HttpContext) {
    try {
    
      const data = await request.validateUsing(createTestValidator)

      const startsAt = DateTime.fromJSDate(data.starts_at)
      const endsAt = DateTime.fromJSDate(data.ends_at)

      validateTestDates(startsAt, endsAt)
      validateQuestionsCount(data.total_questions, data.questions_id)
      validateUniqueQuestions(data.questions_id)

      // Get authenticated admin user ID (replace with actual auth after setup)
      const createdBy =  auth.admin.id?? 1 // Fallback for now

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
  public async getTestQuestions({response,params}:HttpContext){
       try {
        const{  test_id } =params;
        console.log(test_id);
        const isValid:Boolean=await this.TestService.exists(test_id);
        if(!isValid){
          throw new Error('Invalid test Id')
        }

        const data = await this.QuestionService.getAlltestQuestions(test_id)

        return response.status(200).send(data);


       } catch (error) {
        if (error.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages,
        })
      }
      const message = error instanceof Error ? error.message : 'Failed to check valid test'
      
      return response.status(400).badRequest({
        message,
      })
        
       }
         
  }
  public async submissionTest({ request, response }: HttpContext){
    try {
      const data = await request.validateUsing(TestsubmissionValidator)

      // Convert string dates to Date objects

      const started_at:DateTime=DateTime.fromISO(data.started_at);
      const submitted_at:DateTime=DateTime.fromISO(data.submitted_at)
      if(started_at>=submitted_at) {
         throw new Error('Start time must be earlier than end time')
      }
      const processedData = {
        ...data,
        started_at,
        submitted_at
      }

    
      const submission=await this.TestService.submission(processedData)

      return response.created({
        message: 'Test submission created successfully',
        data: submission,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Validation failed',
        errors: error.messages || error.message,
      })
    }
  }

  public async testResult({params,response}:HttpContext){
     try {
         const {test_id}=params;
 
         const results=await this.TestService.result(test_id);
         return response.status(200).send({
           message:"result data",
           data: results
         })
     } catch (error) {
       return response.badRequest({
        message: 'Test Result failed',
        errors: error.messages || error.message,
      })
     }
  }
  public async tests({response}:HttpContext){
    try {
      const data=await this.TestService.tests();

      return response.status(200).send({
          message:"All tests",
          tests:data
      })
    } catch (error) {
        return response.badRequest({
        message: 'Validation failed',
        errors: error.messages || error.message,
      })
    }
        


  }

}