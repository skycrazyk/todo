import type { AppType } from '@app/backend'
import { hc } from 'hono/client'

export const client = hc<AppType>('http://localhost:8000')
