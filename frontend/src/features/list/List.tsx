import { useDelListMutation } from '../api/api.ts'
import { getListId } from '../lists/getListId.ts'
import { Todos } from '../Todos/Todos.tsx'
import type { List } from '@app/backend'
import s from './List.module.css'

export function List({
  list: { id, title },
  onEditBlur,
  onEditKeyDown
}: {
  list: List
  onEditBlur: React.FocusEventHandler<HTMLInputElement>
  onEditKeyDown: React.KeyboardEventHandler<HTMLInputElement>
}) {
  const [del] = useDelListMutation()

  return (
    <li data-listid={id} className={s.list}>
      <div className={s.header}>
        <input
          className={s.titleInput}
          type="text"
          defaultValue={title}
          placeholder="List name"
          onBlur={onEditBlur}
          onKeyDown={onEditKeyDown}
        />
        <button
          type="button"
          className={s.del}
          onClick={(e) => {
            const listId = getListId(e)
            del({ json: { id: Number(listId) } })
          }}
        >
          X
        </button>
      </div>
      <Todos listId={id} />
    </li>
  )
}

export type ListProps = React.ComponentProps<typeof List>
