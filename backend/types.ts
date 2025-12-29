import type { BackendSuccess } from './utils/index.ts'
import { z } from 'zod'

export type BackendRes = BackendSuccess

export const zUser = z.object({
  id: z.number(),
  email: z.email()
})

export type User = z.infer<typeof zUser>

export const zIdentity = z.object({
  id: z.number(),
  user_id: z.number(),
  iss: z.string(),
  sub: z.string()
})

export type Identity = z.infer<typeof zIdentity>

export const zComboUser = z.object({
  ...zUser.shape,
  ...zIdentity.shape,
  identity_id: z.number()
})

export type ComboUser = z.infer<typeof zComboUser>
