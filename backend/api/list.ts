import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../database.ts'
import type { CudRes } from '../common.ts'
import type { Env } from '../main.ts'

const zList = z.object({
  id: z.number(),
  title: z.string().optional(),
  user_id: z.string()
})

export type List = z.infer<typeof zList>

const zPost = z.object({ title: z.string().optional() })

const app = new Hono<Env>().post('/', zValidator('json', zPost), (c) => {
  const user = c.get('user')
  const data = c.req.valid('json')

  const insert = db.prepare(`
    INSERT INTO lists(title, user_id)
    VALUES (:title, :user_id)
  `)

  const result = insert.run({ ...data, user_id: user.id })

  return c.json<CudRes>(
    result
      ? { success: true, msg: 'List created successfully' }
      : { error: true, msg: 'List wasn`t created' }
  )
})

export default app
