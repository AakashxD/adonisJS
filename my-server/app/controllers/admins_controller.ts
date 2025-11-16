import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import { adminRegisterValidator } from '#validators/admin_register'
import { adminLoginValidator } from '#validators/admin_login'
import hash from '@adonisjs/core/services/hash'

// Extend HttpContext to include auth property
declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth: any
  }
}

export default class AdminsController {
  /**
   * Register a new admin
   */
  public async register({ request, response, auth }: HttpContext) {
    try {
      // Validate request data
      const payload = await request.validateUsing(adminRegisterValidator)

      // Check if email already exists
      const existingAdmin = await Admin.findBy('email', payload.email)
      if (existingAdmin) {
        return response.badRequest({
          message: 'Email already exists',
        })
      }

      // Create admin - password will be hashed by @beforeSave hook
      const admin = await Admin.create({
        name: payload.name,
        email: payload.email,
        passwordHash: payload.password, // Will be hashed by model hook
        role: payload.role,
      })

      // Create access token for the newly registered admin
      const token = await auth.use('admin').createToken(admin)

      return response.status(201).created({
        message: 'Admin registered successfully',
        data: {
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
          },
          token: { type: token.type, token: token.value!.release() },
        },
      })
    } catch (err) {
      if (err.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: err.messages,
        })
      }

      const message = err instanceof Error ? err.message : 'Failed to register admin'
      return response.badRequest({
        message,
      })
    }
  }

  /**
   * Login admin and return JWT token
   */
  public async login({ request, response, auth }: HttpContext) {
    try {
      // Validate request data
      const payload = await request.validateUsing(adminLoginValidator)

      // Find admin by email
      const admin = await Admin.findBy('email', payload.email)
      if (!admin) {
        return response.unauthorized({
          message: 'Invalid credentials',
        })
      }

      // Verify password
      const isValidPassword = await hash.verify(admin.passwordHash, payload.password)
      if (!isValidPassword) {
        return response.unauthorized({
          message: 'Invalid credentials',
        })
      }

      // Create access token for the authenticated admin
      const token = await auth.use('admin').createToken(admin)

      return response.ok({
        message: 'Login successful',
        data: {
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
          },
          token: { type: token.type, token: token.value!.release() },
        },
      })
    } catch (err) {
      if (err.messages) {
        return response.badRequest({
          message: 'Validation failed',
          errors: err.messages,
        })
      }

      const message = err instanceof Error ? err.message : 'Failed to login'
      return response.badRequest({
        message,
      })
    }
  }

  /**
   * Get authenticated admin user
   * Auth is available from middleware, authenticate using JWT guard
   */
    public async me({ response, auth }: HttpContext) {
      try {
        // Authenticate using JWT guard
        const admin = await auth.use('admin').authenticate()

        return response.ok({
          message: 'Admin retrieved successfully',
          data: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
          },
        })
      } catch (err) {
        return response.unauthorized({
          message: 'Unauthorized',
        })
      }
    }
  }

