import router from '@adonisjs/core/services/router'
import QuestionController from '#controllers/question_controller'
import AdminsController from '#controllers/admins_controller'
import { middleware } from './kernel.js'
import TestController from '#controllers/test_controller'

// Admin authentication routes
router.post('/register', [AdminsController, 'register'])
router.post('/login', [AdminsController, 'login'])
// router.get('/me', [AdminsController, 'me']).use(middleware.auth({ guards: ['admins'] }))


router.post('/api/create-question',[QuestionController,'create'])
router.get('/api/questions',[QuestionController,'getAllQuestion'])



router.post('/api/create-test',[TestController,'create'])
router.get('/api/test-questions/:test_id',[TestController,'getTestQuestions']);
router.post('/api/submit-test',[TestController,'submissionTest'])
router.get('/api/test-result/:test_id',[TestController,'testResult'])



router.get('/', async () => {


  
  return { message: 'Welcome to Quiz API' }
})

export default router
