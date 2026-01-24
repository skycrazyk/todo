import { z } from 'zod'
import { factory } from '../factory.ts'
import { exception, success, zValidator } from '../utils/index.ts'

const zList = z.object({
  id: z.number(),
  title: z.string().optional(),
  user_id: z.number()
})

export type List = z.infer<typeof zList>

const zListRes = zList.omit({ user_id: true })

export type ListRes = z.infer<typeof zListRes>

const zPost = z.object({ title: z.string().optional().default('') })
export type ZPost = z.infer<typeof zPost>

const zDelete = z.object({ id: z.number() })
export type ZDelete = z.infer<typeof zDelete>

const zPatch = zListRes.pick({ id: true, title: true }).partial({ title: true })
export type ZPatch = z.infer<typeof zPatch>

const app = factory
  .createApp()
  .post('/', zValidator('json', zPost), (c) => {
    const user = c.get('user')
    const data = c.req.valid('json')

    const result = c
      .get('db')
      .prepare(
        `
        INSERT INTO lists(title, user_id)
        VALUES (:title, :user_id)
        `
      )
      .run({ ...data, user_id: user.id })

    if (!result) {
      exception(c, 500, 'List wasn`t created')
    }

    return success(c, 'List created successfully')
  })
  .delete('/', zValidator('json', zDelete), (c) => {
    const user = c.get('user')
    const data = c.req.valid('json')

    // Определяем принадлежность списка пользователю
    const list = c
      .get('db')
      .prepare(
        `
      SELECT * FROM lists 
      WHERE id = (:id) AND user_id = (:user_id)
      `
      )
      .get<ListRes>({ ...data, user_id: user.id })

    if (!list) {
      exception(c, 404, 'List not found or does not belong to user')
    }

    // Удаляем все задачи из списка
    c.get('db')
      .prepare(
        `
      DELETE FROM todos 
      WHERE list_id = (:id) 
      `
      )
      .run(data)

    // Удаляем список
    const result = c
      .get('db')
      .prepare(
        `
        DELETE FROM lists 
        WHERE id = (:id) AND user_id = (:user_id)
        `
      )
      .run({ ...data, user_id: user.id })

    if (!result) {
      exception(c, 500, 'List wasn`t created')
    }

    return success(c, 'List created successfully')
  })
  .patch('/', zValidator('json', zPatch), (c) => {
    const user = c.get('user')
    const jReq = c.req.valid('json')

    // Определяем принадлежность списка пользователю
    const list = c
      .get('db')
      .prepare(
        `
      SELECT * FROM lists 
      WHERE id = (:id) AND user_id = (:user_id)
      `
      )
      .get<ListRes>({ id: jReq.id, user_id: user.id })

    if (!list) {
      exception(c, 404, 'List not found or does not belong to user')
    }

    // Формируем список измененных полей
    const setClauses = Object.keys(jReq)
      .filter((c) => !['id'].includes(c))
      .map((c) => `${c} = (:${c})`)
      .join(', ')

    // Обновляем список
    const result = c
      .get('db')
      .prepare(
        `
      UPDATE lists
      SET ${setClauses}   
      WHERE id = (:id) AND user_id = (:userId)
    `
      )
      .run({ ...jReq, userId: user.id })

    if (!result) {
      exception(c, 404, "List wasn't changed")
    }

    return success(c, 'List changed successfully')
  })

export default app
