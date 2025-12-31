import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ZError } from '@app/shared'

export const errorHandler: ErrorHandler = (e, c) => {
  console.error(e)

  if (e instanceof HTTPException) {
    return e.getResponse()
  }

  return c.json(
    {
      name: 'AppError',
      message: 'Unknown server error'
    } satisfies ZError,
    500
  )
}
