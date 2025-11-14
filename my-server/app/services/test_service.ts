import Test from "#models/tests"
import TestQuestion from "#models/test_question"
import db from "@adonisjs/lucid/database"
interface CreateTestQuestionData {
  questionText?: string
  questionImageUrl?: string
  correctOption: 'A' | 'B' | 'C' | 'D'
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  difficulty: string
}
interface createTestData{
     title:string,
    description?:string,
    status?:string,
    duration?:number,
    startDate?:Date,
    endDate?:Date
    isActive?:boolean
    questions?:CreateTestQuestionData[]
}

export default class TestService{
        async createTest(data:createTestData,adminId:number){
        const trx = await db.transaction()
        try {
            for(const questionData of data.questions || []){
                if(!questionData.questionText && !questionData.questionImageUrl){
                    throw new Error('Either question text or image URL must be provided')
                }
                 

               
            }
        } catch (error) {
            
        }


}
}