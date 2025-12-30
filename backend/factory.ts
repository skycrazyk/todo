import { createFactory } from 'hono/factory'
import type { Env } from './types.ts'

export const factory = createFactory<Env>()
