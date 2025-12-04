import { useAuth } from '@clerk/clerk-react'
import React, { useCallback, useEffect, useState } from 'react'
import { tokenManager } from './tokenManager.ts'
import { tokenConfig } from '../../common.ts'

export const RequireToken = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()
  const [token, setToken] = useState<string>()

  const fetchToken = useCallback(async () => {
    const token = await auth.getToken(tokenConfig)

    if (!token) return

    setToken(token)
    tokenManager.token = token
  }, [auth])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  return token ? <>{children}</> : undefined
}
