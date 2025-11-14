// app/services/question_service.ts
import Question from '#models/question'

interface CreateQuestionInput {
  question_text?: string
  question_image_url?: string
  correct_option: 'A' | 'B' | 'C' | 'D'
  is_options_image?:boolean
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  difficulty: string
  created_by?: number | null
}

export class QuestionService {
  public async create(input: CreateQuestionInput) {
    if (!input.question_text && !input.question_image_url) {
      throw new Error('Either question text or image URL must be provided')
    }

    if(input.is_options_image){
        //  UPLOAD IMAGES HERE IN S3
    }
    if(input.question_image_url){
        //  UPLOAD IMAGE HERE IN S3
    }
    const question = await Question.create({
      questionText: input.question_text ?? null,
      questionImageUrl: input.question_image_url ?? null,
      correctOption: input.correct_option,
      optionA: input.option_a,
      optionB: input.option_b,
      optionC: input.option_c,
      optionD: input.option_d,
      difficulty: input.difficulty,
      createdBy: input.created_by ?? null,
    })

    return question
  }
}
