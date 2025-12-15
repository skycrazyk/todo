import { useDelListMutation } from '../../api.ts'
import { getListId } from '../lists/getListId.ts'
import { Todos } from '../Todos/Todos.tsx'
import type { List } from '@app/backend'

export function List({
  list: { id, title },
  onEditClick,
  onEditBlur,
  onEditKeyDown,
  className
}: {
  list: List
  onEditClick: React.MouseEventHandler<HTMLSpanElement>
  onEditBlur: React.FocusEventHandler<HTMLInputElement> | undefined
  onEditKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  className?: string
}) {
  const [del] = useDelListMutation()

  return (
    <li key={id} data-listid={id} className={className}>
      <div>
        <button
          type="button"
          onClick={(e) => {
            const listId = getListId(e)
            del({ json: { id: Number(listId) } })
          }}
        >
          X
        </button>
        <span>{id}</span>
        <input
          type="text"
          defaultValue={title}
          readOnly={!onEditBlur}
          placeholder="Noname"
          onClick={onEditClick}
          onBlur={onEditBlur}
          onKeyDown={onEditKeyDown}
        />
      </div>
      <Todos listId={id} />
    </li>
  )
}

export type ListProps = React.ComponentProps<typeof List>
