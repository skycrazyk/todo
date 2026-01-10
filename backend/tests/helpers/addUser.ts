import type { Database } from '@db/sqlite'
import type { Identity, User } from '../../types.ts'

export function addUser(
  db: Database,
  testUser: { email: string; iss: string; sub: string }
) {
  const user = db
    .prepare(
      `
        INSERT INTO users (email)
        VALUES (:email)
        RETURNING * 
    `
    )
    .get<User>({
      email: testUser.email
    })

  if (!user) {
    throw new Error('Failed to add user')
  }

  const identity = db
    .prepare(
      `
        INSERT INTO users_identities (user_id, iss, sub)
        VALUES (:user_id, :iss, :sub)
        RETURNING *
    `
    )
    .get<Identity>({
      user_id: user?.id,
      iss: testUser.iss,
      sub: testUser.sub
    })

  if (!identity) {
    throw new Error('Failed to add identity')
  }

  return {
    ...user,
    identity_id: identity.id,
    iss: identity.iss,
    sub: identity.sub
  }
}
