import type { HttpContext } from '@adonisjs/core/http'
import { CreateTestService } from '#services/test_creation_service'

export default class CreateTestController {
  private createTestService = new CreateTestService()

  public async create({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'title',
        'description',
        'duration_minutes',
        'total_questions',
        'questions_id',
        'starts_at',
        'ends_at',
      ])
      const createdTest = await this.createTestService.create(data)

      return response.created({
        message: 'Test created successfully',
        data: createdTest,
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Failed to create test',
      })
    }
  }
}
