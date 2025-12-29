import { createFactory } from 'hono/factory'
import type { ComboUser } from './types.ts'
import type { db } from './database.ts'

export type Env = {
  Variables: {
    user: ComboUser
    db: typeof db
  }
}

export const factory = createFactory<Env>()
