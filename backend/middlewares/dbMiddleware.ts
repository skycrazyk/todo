import { factory } from '../factory.ts'
import type { Database } from '@db/sqlite'

export const dbMiddleware = (db: Database) =>
  factory.createMiddleware(async (c, next) => {
    c.set('db', db)
    await next()
  })
