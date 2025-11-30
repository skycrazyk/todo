import { useAuth } from '@clerk/clerk-react'
import { tokenManager } from './tokenManager.ts'
import React, { useEffect, useState } from 'react'

export const RequireToken = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth()
  const [token, setToken] = useState<string>()

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({ template: 'base-template' })
      if (!token) return
      setToken(token)
      tokenManager.token = token
    }

    fetchToken()
  }, [getToken])

  return token ? <>{children}</> : undefined
}
