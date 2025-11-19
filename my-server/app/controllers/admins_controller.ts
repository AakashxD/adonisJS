import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import { adminRegisterValidator } from '#validators/admin_register'
import { adminLoginValidator } from '#validators/admin_login'
import hash from '@adonisjs/core/services/hash'



declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth: any
  }
} 

export default class AdminsController {

  public async register({ request, response, auth }: HttpContext) {
    try {
     
      const payload = await request.validateUsing(adminRegisterValidator)

      
      const existingAdmin = await Admin.findBy('email', payload.email)
      if (existingAdmin) {
        return response.badRequest({
          message: 'Email already exists',
        })
      }

      
      const admin = await Admin.create({
        name: payload.name,
        email: payload.email,
        passwordHash: payload.password, 
        role: payload.role,
      })

      
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


  public async login({ request, response, auth }: HttpContext) {
    try {
     
      const payload = await request.validateUsing(adminLoginValidator)

     
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
        
    

        return response.ok({
          message: 'Admin retrieved successfully',
          data: {
          auth: auth.user,
          },
        })
      } catch (err) {
        return response.unauthorized({
          message: 'Unauthorized',
        })
      }
    }
  }

