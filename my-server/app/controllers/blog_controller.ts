
import Blog from '#models/blog'
import { HttpContext } from '@adonisjs/core/http'
interface BlogType {
  id: number
  title: string
  content: string
  created_at: Date | null
  updated_at: Date | null
}

export default class BlogController {
  public async getAllBlogs({ response }: HttpContext) {
    const blogs = await Blog.all()
    return response.json(blogs.map((blog) => blog.toJSON() as BlogType))
  }

  public async getBlogById({ params, response }: HttpContext) {
    const blog = await Blog.find(params.id)

    if (!blog) {
      return response.status(404).json({ message: 'Blog not found' })
    }

    return response.json(blog.toJSON() as BlogType)
  }

  public async createBlog({ request, response }: HttpContext) {
    const { title, content } = request.body()

    const blog = await Blog.create({ title, content })

    return response.status(201).json(blog.toJSON() as BlogType)
  }

  public async updateBlog({ params, request, response }: HttpContext) {
    const blog = await Blog.find(params.id)

    if (!blog) {
      return response.status(404).json({ message: 'Blog not found' })
    }

    const { title, content } = request.body()
    blog.merge({ title, content })
    await blog.save()

    return response.json(blog.toJSON() as BlogType)
  }

  public async deleteBlog({ params, response }: HttpContext) {
    const blog = await Blog.find(params.id)

    if (!blog) {
      return response.status(404).json({ message: 'Blog not found' })
    }

    await blog.delete()
    return response.status(200).json({ message: 'Blog deleted successfully' })
  }
}