/*
|--------------------------------------------------------------------------
| HTTP server entrypoint (robust importer)
|--------------------------------------------------------------------------
|
| This version of server.ts improves the IMPORTER used by Ignitor so that
| imports resolve from:
| 1) relative paths (./, ../)
| 2) known Adonis aliases (e.g. #controllers, #models, #start, #types)
| 3) project-root relative attempts (tries app/Controllers/Http, app/Controllers, app/Models)
| 4) node package resolution (import(filePath)) as a last resort
|
| This makes importing application modules from early boot files less error
| prone. Nonetheless: best practice is to avoid importing application code
| from bootstrap files when possible — use start/routes.ts for route wiring.
|
*/

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)

/**
 * Map of common Adonis aliases -> folder relative to project root.
 * Add entries here if you use other aliases in .adonisrc.ts
 */
const ADONIS_ALIASES: Record<string, string> = {
  '#controllers': 'app/Controllers/Http',
  '#models': 'app/Models',
  '#start': 'start',
  '#config': 'config',
  '#types': 'types',
  '#app': 'app',
}

/**
 * Try to import a module using several resolution strategies.
 * - If filePath starts with ./ or ../ -> import relative to APP_ROOT
 * - If it starts with a known alias like "#controllers" -> map and import
 * - Try project-root relative imports (app/Controllers/Http, app/Controllers, app/Models)
 * - Fallback to Node's resolution (import(filePath))
 *
 * Returns a Promise that resolves to the imported module.
 */
const IMPORTER = async (filePath: string) => {
  // 1) Strict relative imports: keep original behavior
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }

  // 2) Known Adonis aliases (like '#controllers/BlogsController')
  for (const alias of Object.keys(ADONIS_ALIASES)) {
    if (filePath.startsWith(alias)) {
      const relPath = filePath.replace(alias, ADONIS_ALIASES[alias])
      try {
        return import(new URL(`./${relPath}`, APP_ROOT).href)
      } catch (err) {
        // continue to other strategies if alias resolution fails
        break
      }
    }
  }

  // Helper to attempt import with different candidate paths
  const tryImports = async (candidates: string[]) => {
    let lastError: any = null
    for (const candidate of candidates) {
      try {
        return await import(new URL(candidate, APP_ROOT).href)
      } catch (err) {
        lastError = err
      }
    }
    throw lastError
  }

  // 3) Project-root relative attempts (useful for bare imports like 'BlogsController' or 'Controllers/BlogsController')
  const candidates = [
    // directly under project root (e.g. import 'server' -> ./server)
    `./${filePath}`,
    // check common controller/model locations
    `./app/Controllers/Http/${filePath}`,
    `./app/Controllers/Http/${filePath}.ts`,
    `./app/Controllers/${filePath}`,
    `./app/Controllers/${filePath}.ts`,
    `./app/Models/${filePath}`,
    `./app/Models/${filePath}.ts`,
    // appended index (folder import)
    `./app/Controllers/Http/${filePath}/index.ts`,
    `./app/Models/${filePath}/index.ts`,
  ]

  try {
    return await tryImports(candidates)
  } catch (projectErr) {
    // 4) Fallback to Node package resolution (may throw if package not found)
    try {
      return import(filePath)
    } catch (nodeErr) {
      // If both project and Node resolution fail, rethrow a helpful error showing both failures
      const e = new Error(
        `Failed to import '${filePath}'. Tried project paths and node resolution.\nproject error: ${projectErr?.message}\nnode error: ${nodeErr?.message}`
      )
      // preserve stack traces where possible
      ;(e as any).projectError = projectErr
      ;(e as any).nodeError = nodeErr
      throw e
    }
  }
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
