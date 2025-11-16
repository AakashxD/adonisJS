import router from '@adonisjs/core/services/router'
import QuestionController from '#controllers/question_controller'

router.get('/api/questions', [QuestionController, 'getAllQuestion'])

export default router
