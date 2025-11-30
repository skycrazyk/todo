import { useEffect } from 'react'
import { useAuthQuery } from '../../api.ts'

export const TestAuth = () => {
  const { data } = useAuthQuery({})

  useEffect(() => {
    console.log('Auth data:', data)
  }, [data])

  return <div>Test Auth</div>
}
