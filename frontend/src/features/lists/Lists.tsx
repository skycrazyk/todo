import { useState } from 'react'
import { useAddListMutation, useGetListsQuery } from '../../api.ts'
import { List } from '../list/List.tsx'

export function Lists() {
  const [editId, setEditId] = useState('')
  const { data: lists } = useGetListsQuery({})
  const [add] = useAddListMutation()

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
        {lists?.map((list) => (
          <List list={list} key={list.id} />
        ))}
      </ul>
    </div>
  )
}
