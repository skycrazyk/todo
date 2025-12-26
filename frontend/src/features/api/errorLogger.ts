import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { zError } from '@app/shared'

export const errorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { payload } = action
    const parsed = zError.safeParse(payload)

    if (parsed.success) {
      if (parsed.data.name !== 'ZotError') {
        toast.error(parsed.data.message)
      }
    }
  }

  return next(action)
}
