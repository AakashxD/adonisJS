import type { HttpContext } from '@adonisjs/core/http'
import { QuestionService } from '#services/question_service'

export default class QuestionCreationsController {
  private questionService = new QuestionService()

  public async create({ request, response }: HttpContext) {
    try {
      const payload = request.only([
        'question_text',
        'question_image_url',
        'correct_option',
        'is_options_image',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'difficulty',
      ])

      const question = await this.questionService.create({
        ...payload,
        // replace with admin id after auth setUp
        created_by: 1,
      })
     return  response.status(201).send({
        message: 'Question created successfully',
        data: question,
     })
    
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create question'

      return response.status(401).send({
        error: message,
    })
  }
}
}
