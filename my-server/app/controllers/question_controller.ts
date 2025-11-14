import type { HttpContext } from '@adonisjs/core/http'
import { QuestionService } from '#services/question_service'
import { createQuestionValidator, validateQuestionContent } from '#validators/question_validator'
import { UUID } from 'crypto'

export default class QuestionController {
  private questionService = new QuestionService()

  public async create({ request, response }: HttpContext) {
    try {

      // Validate request data
      const payload = await request.validateUsing(createQuestionValidator)

      
      // Additional validation: ensure either question_text or question_image_url exists
      validateQuestionContent(payload)

      // Get authenticated admin user ID (replace with actual auth after setup)
      const createdBy =  1 // Fallback for now

      const question = await this.questionService.create({
        ...payload,
        created_by: createdBy,
      })

      return response.created({
        message: 'Question created successfully',
        data: question,
      })
    } catch (err) {
      
      if (err.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: err.messages,
        })
      }

     
      const message = err instanceof Error ? err.message : 'Failed to create question'
      
      return response.badRequest({
        message,
      })
    }
  }

  public async getTestQuestions(test_id:UUID){
         
  }

}