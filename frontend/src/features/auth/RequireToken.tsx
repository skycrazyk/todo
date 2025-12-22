import { useAuth } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { tokenManager } from './tokenManager.ts'
import { tokenConfig } from '../../common.ts'

export const RequireToken = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()
  const [token, setToken] = useState<string>()

  useEffect(() => {
    const fetchToken = async () => {
      const token = await auth.getToken(tokenConfig)

      if (!token) return

      setToken(token)
      tokenManager.token = token
    }

    fetchToken()
  }, [auth])

  return token ? <>{children}</> : undefined
}
