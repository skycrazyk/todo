import React, { useEffect, useState } from 'react'
import {
  useAddMutation,
  useDelMutation,
  usePatchMutation,
  useTodosQuery
} from '../../api.ts'
import { Todo, type TodoProps } from '../todo/Todo.tsx'
import { getTodoId } from '../todo/getTodoId.ts'

export function List() {
  const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all')
  const { data: dataFiltered } = useTodosQuery({
    query: { ...(['true', 'false'].includes(filter) && { done: filter }) }
  })
  const [newTitle, setNewTitle] = useState('')
  const [editId, setEditId] = useState('')
  const [add, { isSuccess: addIsSuccess }] = useAddMutation()
  const [del] = useDelMutation()
  const [patch] = usePatchMutation()

  const onDelClick: TodoProps['onDelClick'] = (e) => {
    const id = getTodoId(e)
    del({ json: { id: Number(id) } })
  }

  const onAddEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') return

    const { value } = e.currentTarget
    const title = value.trim()

    if (title) {
      add({ json: { title } })
    }
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value)
  }

  const onEditClick: TodoProps['onEditClick'] = (e) => {
    const id = getTodoId(e)
    setEditId(id.toString())
  }

  const onEditBlur: TodoProps['onEditBlur'] = (e) => {
    const id = getTodoId(e)
    const { value } = e.currentTarget
    patch({ json: { id: Number(id), title: value.trim() } })
    setEditId('')
  }

  const onEditKeyDown: TodoProps['onEditKeyDown'] = (e) => {
    if (e.key === 'Escape') {
      setEditId('')
    }

    if (e.key === 'Enter') {
      const id = getTodoId(e)
      const { value } = e.currentTarget
      patch({ json: { id: Number(id), title: value.trim() } })
      setEditId('')
    }
  }

  const onDoneChange: TodoProps['onDoneChange'] = (e) => {
    const id = getTodoId(e)
    const { checked } = e.currentTarget

    patch({ json: { id: Number(id), done: checked } })
  }

  useEffect(() => {
    if (addIsSuccess) {
      setNewTitle('')
    }
  }, [addIsSuccess])

  return (
    <div>
      <div>
        Add new
        <input
          type="text"
          value={newTitle}
          onKeyDown={onAddEnter}
          onChange={onTitleChange}
        />
      </div>
      <div>
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>
          All
        </button>
        <button onClick={() => setFilter('true')} disabled={filter === 'true'}>
          Done
        </button>
        <button
          onClick={() => setFilter('false')}
          disabled={filter === 'false'}
        >
          Undone
        </button>
      </div>
      <ul>
        {dataFiltered?.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onDelClick={onDelClick}
            onEditClick={onEditClick}
            onEditBlur={onEditBlur}
            onDoneChange={onDoneChange}
            onEditKeyDown={
              editId === todo.id.toString() ? onEditKeyDown : undefined
            }
          />
        ))}
      </ul>
    </div>
  )
}
