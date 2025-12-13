import { useState } from 'react'
import {
  useAddListMutation,
  useGetListsQuery,
  useUpdListMutation
} from '../../api.ts'
import { List, type ListProps } from '../list/List.tsx'
import { getListId } from './getListId.ts'

export function Lists() {
  const [editId, setEditId] = useState('')
  const { data: lists } = useGetListsQuery({})
  const [add] = useAddListMutation()
  const [upd] = useUpdListMutation()

  const onEditClick: ListProps['onEditClick'] = (e) => {
    const id = getListId(e)
    setEditId(id.toString())
  }

  const onEditBlur: ListProps['onEditBlur'] = (e) => {
    const id = getListId(e)
    const { value } = e.currentTarget
    upd({ json: { id: Number(id), title: value } })
    setEditId('')
  }

  const onEditKeyDown: ListProps['onEditKeyDown'] = (e) => {
    if (e.key === 'Escape') {
      setEditId('')
    }

    if (e.key === 'Enter') {
      const id = getListId(e)
      const { value } = e.currentTarget
      upd({ json: { id: Number(id), title: value.trim() } })
      setEditId('')
    }
  }

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
          <List
            list={list}
            key={list.id}
            onEditClick={onEditClick}
            onEditBlur={list.id.toString() === editId ? onEditBlur : undefined}
            onEditKeyDown={onEditKeyDown}
          />
        ))}
      </ul>
    </div>
  )
}
