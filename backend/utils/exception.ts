import { HTTPException } from 'hono/http-exception'
import type { Ctx } from '../main.ts'

export function exception<T extends Ctx>(
  ctx: T,
  code: HTTPException['status'],
  message: string
) {
  throw new HTTPException(code, {
    res: ctx.json({
      success: false,
      error: {
        name: 'AppError',
        message: message
      }
    } satisfies BackendError)
  })
}

export type BackendError = {
  success: false
  error: {
    name: 'AppError' | 'ZotError'
    message: string
  }
}
