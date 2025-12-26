import { z } from 'zod'
// TODO перенести результат getAuth в hono c.get('auth')
import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
// TODO перенести результат db в hono c.get('db')
import { db } from '../database.ts'

const zUser = z.object({
  id: z.number(),
  email: z.email()
})

type User = z.infer<typeof zUser>

const zIdentity = z.object({
  id: z.number(),
  user_id: z.number(),
  iss: z.string(),
  sub: z.string()
})

type Identity = z.infer<typeof zIdentity>

const zComboUser = z.object({
  ...zUser.shape,
  ...zIdentity.shape,
  identity_id: z.number()
})

export type ComboUser = z.infer<typeof zComboUser>

const ensureUser = db.transaction((auth: ReturnType<typeof getAuth>) => {
  const stmtGetComboUser = db.prepare(`
      SELECT u.*, ui.id as identity_id, ui.sub, ui.iss 
      FROM users u
      INNER JOIN users_identities ui
      ON u.id = ui.user_id
      WHERE iss = (:iss) AND sub = (:sub)
    `)

  const existing = stmtGetComboUser.get<ComboUser>({
    iss: auth?.sessionClaims?.iss,
    sub: auth?.userId
  })

  if (existing) return existing

  const stmtCreateUser = db.prepare(`
        INSERT INTO users(email)
        VALUES(:email)
        RETURNING *
      `)

  const user = stmtCreateUser.get<User>({
    email: auth?.sessionClaims?.email as string // TODO need fix typings
  })

  const stmtCreateIdentity = db.prepare(`
        INSERT OR IGNORE INTO users_identities(user_id, iss, sub)
        VALUES(:user_id, :iss, :sub)
        RETURNING *
      `)

  const identity = stmtCreateIdentity.get<Identity>({
    user_id: user?.id as number,
    iss: auth?.sessionClaims?.iss,
    sub: auth?.userId
  })

  return stmtGetComboUser.get<ComboUser>({
    iss: identity?.iss,
    sub: identity?.sub
  })
})

export const userMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c)
  const comboUser = ensureUser(auth)

  c.set('user', comboUser)

  await next()
})
