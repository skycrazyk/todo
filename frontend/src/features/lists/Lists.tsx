import { de } from 'zod/v4/locales'
import {
  useAddListMutation,
  useDelListMutation,
  useGetListsQuery
} from '../../api.ts'
import { List } from '../list/List.tsx'
import { getListId } from './getListId.ts'

export function Lists() {
  const { data: lists } = useGetListsQuery({})
  const [add] = useAddListMutation()
  const [del] = useDelListMutation()

  return (
    <div>
      <div>
        <input
          type="text"
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Enter':
                add({ json: { title: e.currentTarget.value } })
                e.currentTarget.value = ''
                break
              case 'Escape':
                e.currentTarget.value = ''
                break
              default:
                break
            }
          }}
        />
      </div>
      <ul>
        {lists?.map(({ id, title }) => (
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
              <input type="text" value={title} readOnly placeholder="Noname" />
            </div>
            <List listId={id} />
          </div>
        ))}
      </ul>
    </div>
  )
}
