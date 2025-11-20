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

  async create(input: CreateQuestionInput): Promise<Question> {
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

  async exists(questionId: number): Promise<boolean> {
    const question = await Question.find(questionId)
    return question !== null
  }

  async validateQuestionsExist(questionIds: number[]): Promise<void> {
    const questions = await Question.query().whereIn('id', questionIds)
    
    if (questions.length !== questionIds.length) {
      const foundIds = questions.map((q) => q.id)
      const missingIds = questionIds.filter((id) => !foundIds.includes(id))
      throw new Error(`Questions with IDs ${missingIds.join(', ')} do not exist`)
    }
  }
  async getAlltestQuestions(testId: string): Promise<any> {

  const testQuestions = await TestQuestion
    .query()
    .where('test_id', testId)
    .preload('question')
  
  const questions = testQuestions
    .filter((tq) => tq.question !== null && tq.question !== undefined)
    .map((tq) => {
      const q = tq.question!
      
      return {
        question_text: q.questionText,
        question_image_url: q.questionImageUrl,
        correct_option: q.correctOption,
        is_options_image: q.isOptionsImage,
        option_a: q.optionA,
        option_b: q.optionB,
        option_c: q.optionC,
        option_d: q.optionD,
        difficulty: q.difficulty,
        created_by: q.createdBy,
      }
    })

  const result = {
    test_id: testId,
    total_questions: questions.length,
    questions,
  }
  
  return result
}
  async getAllQuestions(): Promise<Question[]> {
    const questions: Question[] = await Question.all()
    return questions
  }
   
}