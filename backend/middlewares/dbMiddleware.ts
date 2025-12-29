import { factory } from '../factory.ts'
import { db } from '../database.ts'

export const dbMiddleware = factory.createMiddleware(async (c, next) => {
  c.set('db', db)
  await next()
})
