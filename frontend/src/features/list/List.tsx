import { useDelListMutation } from '../../api.ts'
import { getListId } from '../lists/getListId.ts'
import { Todos } from '../Todos/Todos.tsx'
import type { List } from '@app/backend'

export function List({ list: { id, title } }: { list: List }) {
  const [del] = useDelListMutation()

  return (
    <div key={id} data-listid={id}>
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
          value={title}
          readOnly
          placeholder="Noname"
          onClick={(e) => {
            const listId = getListId(e)
            // TODO
          }}
        />
      </div>
      <Todos listId={id} />
    </div>
  )
}
