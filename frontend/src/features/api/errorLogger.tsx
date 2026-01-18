import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { zError } from '@app/shared'

export const errorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { payload } = action
    const parsed = zError.safeParse(payload)

    if (parsed.success) {
      if (parsed.data.name === 'ZodError' && import.meta.env.DEV) {
        toast.error(
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>Validation Error</div>
            <pre style={{ fontSize: '10px' }}>{parsed.data.message}</pre>
          </div>
        )
      } else {
        toast.error(parsed.data.message)
      }
    }
  }

  return next(action)
}
