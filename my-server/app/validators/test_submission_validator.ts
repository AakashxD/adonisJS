import vine from '@vinejs/vine'

const testsubmissionSchema = vine.object({
  test_id: vine.string().uuid(),
  candidate_id: vine.number().positive(),
  status: vine.enum(['started', 'submitted', 'timeout'] as const),
  answers: vine.any(),
  total_questions: vine.number().min(1),
  correct_answers: vine.number().min(0),
  ip_address: vine.string(),
  started_at: vine.string(),
  submitted_at: vine.string(),
})

export const TestsubmissionValidator = vine.compile(testsubmissionSchema)