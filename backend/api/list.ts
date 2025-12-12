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

const zPost = z.object({ title: z.string().optional().default('') })
const zDelete = z.object({ id: z.number() })
const zPatch = zList.pick({ id: true, title: true }).partial({ title: true })

const app = new Hono<Env>()
  .post('/', zValidator('json', zPost), (c) => {
    const user = c.get('user')
    const data = c.req.valid('json')

    const result = db
      .prepare(
        `
        INSERT INTO lists(title, user_id)
        VALUES (:title, :user_id)
        `
      )
      .run({ ...data, user_id: user.id })

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'List created successfully' }
        : { error: true, msg: 'List wasn`t created' }
    )
  })
  .delete('/', zValidator('json', zDelete), (c) => {
    const user = c.get('user')
    const data = c.req.valid('json')

    // Определяем принадлежность списка пользователю
    const list = db
      .prepare(
        `
      SELECT * FROM lists 
      WHERE id = (:id) AND user_id = (:user_id)
      `
      )
      .get<List>({ ...data, user_id: user.id })

    if (!list) {
      return c.json<CudRes>(
        { error: true, msg: 'List not found or does not belong to user' },
        404
      )
    }

    // Удаляем все задачи из списка
    db.prepare(
      `
      DELETE FROM todos 
      WHERE list_id = (:id) 
      `
    ).run(data)

    // Удаляем список
    const result = db
      .prepare(
        `
        DELETE FROM lists 
        WHERE id = (:id) AND user_id = (:user_id)
        `
      )
      .run({ ...data, user_id: user.id })

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'List created successfully' }
        : { error: true, msg: 'List wasn`t created' }
    )
  })
  .patch('/', zValidator('json', zPatch), (c) => {
    const user = c.get('user')
    const jReq = c.req.valid('json')

    // Определяем принадлежность списка пользователю
    const list = db
      .prepare(
        `
      SELECT * FROM lists 
      WHERE id = (:id) AND user_id = (:user_id)
      `
      )
      .get<List>({ id: jReq.id, user_id: user.id })

    if (!list) {
      return c.json<CudRes>(
        { error: true, msg: 'List not found or does not belong to user' },
        404
      )
    }

    // Формируем список измененных полей
    const setClauses = Object.keys(jReq)
      .filter((c) => !['id'].includes(c))
      .map((c) => `${c} = (:${c})`)
      .join(', ')

    // Обновляем список
    const result = db
      .prepare(
        `
      UPDATE lists
      SET ${setClauses}   
      WHERE id = (:id) AND user_id = (:userId)
    `
      )
      .run({ ...jReq, userId: user.id })

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'List changed successfully' }
        : { error: true, msg: "List wasn't changed" }
    )
  })

export default app
