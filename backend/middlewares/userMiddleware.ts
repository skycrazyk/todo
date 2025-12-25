import { z } from 'zod'
import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
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

const comboUser = z.object({
  ...zUser.shape,
  ...zIdentity.shape,
  identity_id: z.number()
})

export type ComboUser = z.infer<typeof comboUser>

// TODO  Добавить блокировку транзакций создания пользователя при необходимости
export const userMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c)

  const stmtGetUser = db.prepare(`
    SELECT u.*, ui.id as identity_id, ui.sub, ui.iss 
    FROM users u
    INNER JOIN users_identities ui
    ON u.id = ui.user_id
    WHERE iss = (:iss) AND sub = (:sub)
  `)

  let comboUser = stmtGetUser.get({
    iss: auth?.sessionClaims?.iss,
    sub: auth?.userId
  })

  if (comboUser) {
    c.set('user', comboUser)
  } else {
    const stmtCreateUser = db.prepare(`
      INSERT INTO users(email)
      VALUES(:email)
      RETURNING *
    `)

    const newUser = stmtCreateUser.get({
      email: auth?.sessionClaims?.email as string // TODO need fix typings
    }) as User

    const stmtCreateIdentity = db.prepare(`
      INSERT INTO users_identities(user_id, iss, sub)
      VALUES(:user_id, :iss, :sub)
      RETURNING *
    `)

    const newIdentity = stmtCreateIdentity.get({
      user_id: newUser?.id as number,
      iss: auth?.sessionClaims?.iss,
      sub: auth?.userId
    }) as Identity

    comboUser = stmtGetUser.get({
      iss: newIdentity?.iss,
      sub: newIdentity?.sub
    })

    c.set('user', comboUser)
  }

  await next()
})
