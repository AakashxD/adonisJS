import Question from '#models/question'
import TestQuestion from '#models/test_question'
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
type QuestionJSON = {
  question_text: string
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
  public async getAlltestQuestions(testId: string): Promise<JSON> {
    const testQuestions = await TestQuestion
      .query()
      .where('test_id', testId)
      .preload('question') 

    const questions: QuestionJSON[] = testQuestions
      .filter((tq) => tq.question)
      .map((tq) => {
        // Lucid model → plain object
        const q = tq.question!.toJSON() as any

        // Map exactly what you want to expose
        const oneQuestion: QuestionJSON = {
          question_text: q.question_text,
          question_image_url: q.question_image_url,
          correct_option: q.correct_option,
          is_options_image: q.is_options_image,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          difficulty: q.difficulty,
          created_by: q.created_by,
        }

        return oneQuestion
      })

    const result = {
      test_id: testId,
      total_questions: questions.length,
      questions,
    }
    return result as unknown as JSON
  }
  public async getAllQuestions(): Promise<Question[]> {
    const questions: Question[] = await Question.all()
    return questions
  }

  public async deleteQuestion(questionID:number):Promise<void>{
    // issue with design  -> discuss in meet

    
  }
}