import z from 'zod'

export const userFoo: ZTestUser = {
  sub: 'foo-user-id',
  iss: 'foo-issuer',
  email: 'foo@example.com'
}

export const userBar: ZTestUser = {
  sub: 'bar-user-id',
  iss: 'bar-issuer',
  email: 'bar@example.com'
}

const zTestUser = z.object({
  sub: z.string(),
  iss: z.string(),
  email: z.email()
})

export type ZTestUser = z.infer<typeof zTestUser>
