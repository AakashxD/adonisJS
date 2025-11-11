import router from '@adonisjs/core/services/router'
const BlogController = () => import('#controllers/blog_controller')

router.get('/api/blogs', [BlogController, 'getAllBlogs'])
router.get('/api/blog/:id', [BlogController, 'getBlogById'])
router.post('/api/blog', [BlogController, 'createBlog'])
router.put('/api/blog/:id', [BlogController, 'updateBlog'])
router.delete('/api/blog/:id', [BlogController, 'deleteBlog'])

export default router
