import { HTTPException } from 'hono/http-exception'
import type { Ctx } from '../main.ts'
import type { ZError } from '@app/shared'

export function exception<T extends Ctx>(
  ctx: T,
  code: HTTPException['status'],
  message: string
) {
  throw new HTTPException(code, {
    res: ctx.json({
      name: 'AppError',
      message: message
    } satisfies ZError)
  })
}
