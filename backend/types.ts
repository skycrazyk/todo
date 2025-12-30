import type { Context } from 'hono'
import { z } from 'zod'
import type { db } from './database.ts'

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

export type Ctx = Context<Env>
export type Env = {
  Variables: {
    user: ComboUser
    db: typeof db
  }
  Bindings: Record<'CLERK_SECRET_KEY' | 'CLERK_PUBLISHABLE_KEY', string>
}
