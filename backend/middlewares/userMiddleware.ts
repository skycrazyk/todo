import type { Auth, ComboUser, Identity, User } from '../types.ts'
import { factory } from '../factory.ts'
import { exception } from '../utils/exception.ts'
import type { Database } from '@db/sqlite'

const ensureUser = (db: Database, auth: Auth) =>
  db.transaction(() => {
    const stmtGetComboUser = db.prepare(`
      SELECT u.*, ui.id as identity_id, ui.sub, ui.iss 
      FROM users u
      INNER JOIN users_identities ui
      ON u.id = ui.user_id
      WHERE iss = (:iss) AND sub = (:sub)
    `)

    const existing = stmtGetComboUser.get<ComboUser>({
      iss: auth.iss,
      sub: auth.sub
    })

    if (existing) return existing

    const stmtCreateUser = db.prepare(`
        INSERT INTO users(email)
        VALUES(:email)
        RETURNING *
      `)

    const user = stmtCreateUser.get<User>({
      email: auth.email
    })

    const stmtCreateIdentity = db.prepare(`
        INSERT OR IGNORE INTO users_identities(user_id, iss, sub)
        VALUES(:user_id, :iss, :sub)
        RETURNING *
      `)

    const identity = stmtCreateIdentity.get<Identity>({
      user_id: user?.id as number,
      iss: auth.iss,
      sub: auth.sub
    })

    return stmtGetComboUser.get<ComboUser>({
      iss: identity?.iss,
      sub: identity?.sub
    })
  })

export const userMiddleware = factory.createMiddleware(async (c, next) => {
  const auth = c.get('auth')
  const db = c.get('db')
  const comboUser = ensureUser(db, auth)()

  if (!comboUser) {
    exception(c, 500, 'Unable to create or retrieve user')
  }

  c.set('user', comboUser)
  await next()
})
