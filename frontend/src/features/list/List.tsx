import { useDelListMutation } from '../../api.ts'
import { getListId } from '../lists/getListId.ts'
import { Todos } from '../Todos/Todos.tsx'
import type { List } from '@app/backend'
import s from './List.module.css'

export function List({
  list: { id, title },
  onEditClick,
  onEditBlur,
  onEditKeyDown
}: {
  list: List
  onEditClick: React.MouseEventHandler<HTMLSpanElement>
  onEditBlur: React.FocusEventHandler<HTMLInputElement> | undefined
  onEditKeyDown: React.KeyboardEventHandler<HTMLInputElement>
}) {
  const [del] = useDelListMutation()

  return (
    <li data-listid={id} className={s.list}>
      <div className={s.header}>
        <input
          className={s.title}
          type="text"
          defaultValue={title}
          readOnly={!onEditBlur}
          placeholder="List name"
          onClick={onEditClick}
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
