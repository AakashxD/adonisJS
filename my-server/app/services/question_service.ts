import Question from '#models/question'

interface CreateQuestionInput {
  question_text?: string
  question_image_url?: string
  correct_option: 'A' | 'B' | 'C' | 'D'
  is_options_image?: boolean
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard'
  created_by?: number | null
}

export class QuestionService {

  public async create(input: CreateQuestionInput): Promise<Question> {
    try {
      let questionImageUrl = input.question_image_url
      let optionAUrl = input.option_a
      let optionBUrl = input.option_b
      let optionCUrl = input.option_c
      let optionDUrl = input.option_d

      
      /***
       *  Write the logic for Question image url if url
       * 
       *  Wrtie the logic for options upload if url
       */

      const question = await Question.create({
        questionText: input.question_text ?? null,
        questionImageUrl: questionImageUrl ?? null,
        correctOption: input.correct_option,
        isOptionsImage: input.is_options_image ?? false,
        optionA: optionAUrl,
        optionB: optionBUrl,
        optionC: optionCUrl,
        optionD: optionDUrl,
        difficulty: input.difficulty,
        createdBy: input.created_by ?? null,
      })

      return question
    } catch (error) {
      console.error('Error creating question:', error)
      throw new Error('Failed to create question in database')
    }
  }

  
  public async exists(questionId: number): Promise<boolean> {
    const question = await Question.find(questionId)
    return question !== null
  }

  public async validateQuestionsExist(questionIds: number[]): Promise<void> {
    const questions = await Question.query().whereIn('id', questionIds)
    
    if (questions.length !== questionIds.length) {
      const foundIds = questions.map((q) => q.id)
      const missingIds = questionIds.filter((id) => !foundIds.includes(id))
      throw new Error(`Questions with IDs ${missingIds.join(', ')} do not exist`)
    }
  }
}