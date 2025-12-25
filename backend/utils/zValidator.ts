import type { z } from 'zod'
import type { ValidationTargets } from 'hono'
import { zValidator as zv } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'

export const zValidator = <
  T extends z.ZodType,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { res: c.json(result.error) })
    }
  })
