import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'

export default defineConfig({
  default: 'admin',
  guards: {
    admin: tokensGuard({
      provider: tokensUserProvider({
        model: () => import('#models/admin'),
        tokens: 'accessTokens', // refers to Admin.accessTokens
      }),
    }),
  },
})
