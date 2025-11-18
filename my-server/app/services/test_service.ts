import TestQuestion from '#models/test_question'
import Test from '#models/tests'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import db from '@adonisjs/lucid/services/db'
import { QuestionService } from '#services/question_service'
import TestSubmission from '#models/test_submission'

interface TestData {
  title: string
  description: string
  duration_minutes: number
  total_questions: number
  questions_id: number[]
  starts_at: DateTime
  ends_at: DateTime
  created_by?: number
}
export type SubmissionPayload = {
  test_id: string
  candidate_id: number
  status: 'started' | 'submitted' | 'timeout'
  answers?:JSON | any
  total_questions: number
  correct_answers: number
  ip_address: string
  started_at: DateTime
  submitted_at: DateTime
}
export class TestService {
  private questionService = new QuestionService()

  async create(data: TestData): Promise<Test> {

    const trx = await db.transaction()

    try {

      await this.questionService.validateQuestionsExist(data.questions_id)

      // Generate unique test ID
      const testId: string = randomUUID()

      const test = await Test.create(
        {
          id: testId,
          title: data.title,
          description: data.description,
          durationMinutes: data.duration_minutes,
          status:'published',
          totalQuestions: data.total_questions,
          startsAt: data.starts_at,
          endsAt: data.ends_at,
          createdBy: data.created_by ?? null,
          isActive: true, 
        },
        { client: trx }
      )
      // Create test-question associations
      const testQuestions = data.questions_id.map((questionId: number, index: number) => ({
        testId: testId,
        questionId,
        questionOrder: index + 1,
      }))

      await TestQuestion.createMany(testQuestions, { client: trx })

      
      
      await trx.commit()

      return test;
    } catch (error) {
      // Rollback transaction on error
      await trx.rollback()

      console.error('Error creating test:', error)

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Failed to create test')
    }
  }

  async exists(testId: string):Promise<boolean> {
    const test = await Test.find(testId)

    if (!test) {
      return false;
    }

    return true;
  }
  async submission(data: SubmissionPayload) {
    const percentage = Number(
      ((data.correct_answers / data.total_questions) * 100).toFixed(2)
    )
  const test_submission = await TestSubmission.create({
  testId: data.test_id,
  candidateId: data.candidate_id,
  status: data.status,
  answers: data.answers,
  totalQuestions: data.total_questions,
  correctAnswers: data.correct_answers,
  ipAddress: data.ip_address,
  score: data.correct_answers,
  percentage,
  startedAt: data.started_at,
  submittedAt: data.submitted_at,
})
    return test_submission
  }
  async result(testId:string){
         const submissions = await TestSubmission.query()
        .where('test_id', testId)
        .preload('test')
        .preload('candidate')


      
      const results = submissions.map((submission) => {
       
        // const attempted = submission.totalQuestions - (
        //   Object.values(submission.answers || {}).filter(
        //     (answer: any) => answer.selected_option === null
        //   ).length
        // )

        return {
          submission_id: submission.id,
          test_id: submission.testId,
          test_name: submission.test.title,
          candidate_id: submission.candidateId,
          candidate_name: submission.candidate.name,
          score: submission.correctAnswers,
          status: submission.status,
          total_questions: submission.totalQuestions,
          correct_answers: submission.correctAnswers,
          started_at: submission.startedAt,
          submitted_at: submission.submittedAt,
        }
      })

      return results;
  }
  async tests(): Promise<Test[]> {
    const tests = await Test.all()

    return tests;
  }
}
