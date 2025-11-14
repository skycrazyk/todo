import React, { useEffect, useState } from 'react'
import {
  useAddMutation,
  useDelMutation,
  usePatchMutation,
  useTodosQuery
} from './api.ts'
import { Todo, type TodoProps } from './Todo.tsx'

function App() {
  const { data } = useTodosQuery({})
  const [newTitle, setNewTitle] = useState('')
  const [editId, setEditId] = useState('')
  const [add, { isSuccess: addIsSuccess }] = useAddMutation()
  const [del] = useDelMutation()
  const [patch] = usePatchMutation()

  const onDelClick: TodoProps['onDelClick'] = (e) =>
    del({ json: { id: Number(e.currentTarget.dataset.id) } })

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

  const onEditClick: TodoProps['onEditClick'] = (e) =>
    setEditId(String(e.currentTarget.dataset.id))

  const onEditBlur: TodoProps['onEditBlur'] = (e) => {
    const { id } = e.currentTarget.dataset
    const { value } = e.currentTarget
    patch({ json: { id: Number(id), title: value.trim() } })
    setEditId('')
  }

  const onEditKeyDown: TodoProps['onEditKeyDown'] = (e) => {
    if (e.key === 'Escape') {
      setEditId('')
    }

    if (e.key === 'Enter') {
      const { id } = e.currentTarget.dataset
      const { value } = e.currentTarget
      patch({ json: { id: Number(id), title: value.trim() } })
      setEditId('')
    }
  }

  const onDoneChange: TodoProps['onDoneChange'] = (e) => {
    const { id } = e.currentTarget.dataset
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
        <input
          type="text"
          value={newTitle}
          onKeyDown={onAddEnter}
          onChange={onTitleChange}
        />
      </div>
      <ul>
        {data?.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            editId={editId}
            onDelClick={onDelClick}
            onEditClick={onEditClick}
            onEditBlur={onEditBlur}
            onDoneChange={onDoneChange}
            onEditKeyDown={onEditKeyDown}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
