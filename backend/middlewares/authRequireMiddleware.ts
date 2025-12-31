import { exception } from '../utils/index.ts'
import { factory } from '../factory.ts'

export const authRequireMiddleware = factory.createMiddleware(
  async (c, next) => {
    const auth = c.get('auth')

    if (!auth?.sub) {
      exception(c, 401, 'Unauthorized')
    }

    return await next()
  }
)
