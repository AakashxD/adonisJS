// config/database.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

/**
 * Parse DATABASE_URL (NeonDB / Supabase / Render etc.)
 * using modern WHATWG URL API.
 */
function connectionFromDatabaseUrl(urlString?: string) {
  if (!urlString) return {}

  try {
    const parsed = new URL(urlString)

    const host = parsed.hostname
    const port = parsed.port ? Number(parsed.port) : 5432
    const user = decodeURIComponent(parsed.username)
    const password = decodeURIComponent(parsed.password)
    const database = parsed.pathname.replace(/^\//, '')

    const sslmode = parsed.searchParams.get('sslmode')
    const ssl =
      sslmode === 'require' || sslmode === 'verify-ca' || sslmode === 'verify-full'
        ? { rejectUnauthorized: false }
        : undefined

    return { host, port, user, password, database, ssl }
  } catch (error) {
    console.error(' Failed to parse DATABASE_URL:', error)
    return {}
  }
}

const urlConnection = connectionFromDatabaseUrl(env.get('DATABASE_URL'))

export default defineConfig({
  connection: env.get('DB_CONNECTION', 'pg'),

  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: urlConnection.host || env.get('DB_HOST', '127.0.0.1'),
        port: urlConnection.port || env.get('DB_PORT', 5432),
        user: urlConnection.user || env.get('DB_USER', 'postgres'),
        password: urlConnection.password || env.get('DB_PASSWORD', ''),
        database: urlConnection.database || env.get('DB_DATABASE', 'adonis'),

        ...(urlConnection.ssl ? { ssl: urlConnection.ssl } : {}),
      },

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      healthCheck: true,
    },
  },
})
