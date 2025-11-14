import TestQuestion from "#models/test_question"
import { randomUUID } from "crypto"
import Test from "#models/tests"
import { DateTime } from "luxon"
interface TestData{
    title:string
    description:string
    duration_minutes:number
    total_questions:number
    questions_id:number[]
    starts_at:DateTime
    ends_at:DateTime
}
export class CreateTestService{
  
  async create(data:TestData){
  
         const test_id:string=randomUUID()
    await TestQuestion.createMany(
      data.questions_id.map((questionId: number, index: number) => ({
        testId: test_id, 
        questionId,
        questionOrder: index + 1,
      }))
    )

    const test=await Test.create({
        id:test_id,
        title:data.title,
        description:data.description,
        durationMinutes:data.duration_minutes,
        totalQuestions:data.total_questions,
        startsAt:data.starts_at,
        endsAt:data.ends_at,

    })
    return test;
  }

}