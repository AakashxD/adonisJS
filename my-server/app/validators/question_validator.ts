import vine from '@vinejs/vine'

export const createQuestionValidator = vine.compile(
  vine.object({
    question_text: vine.string().trim().minLength(10).maxLength(1000).optional(),
    question_image_url: vine.string().trim().optional(),
    correct_option: vine.enum(['A', 'B', 'C', 'D']),
    is_options_image: vine.boolean().optional(),
    option_a: vine.string().trim().minLength(1),
    option_b: vine.string().trim().minLength(1),
    option_c: vine.string().trim().minLength(1),
    option_d: vine.string().trim().minLength(1),
    difficulty: vine.enum(['easy', 'medium', 'hard','very_hard']),
  })
)

export const validateQuestionContent = (data: any) => {
  if (!data.question_text && !data.question_image_url) {
    throw new Error('Either question_text or question_image_url must be provided')
  }
}