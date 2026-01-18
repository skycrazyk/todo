import React, { useEffect, useState } from 'react'
import {
  useAddTodoMutation,
  useDelTodoMutation,
  useUpdTodoMutation,
  useTodosQuery
} from '../api/api.ts'
import { Todo, type TodoProps } from '../todo/Todo.tsx'
import { getTodoId } from '../todo/getTodoId.ts'
import s from './Todos.module.css'

export function Todos({ listId }: { listId: number }) {
  const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all')

  const { data: todos } = useTodosQuery({
    query: {
      list_id: listId.toString(),
      ...(['true', 'false'].includes(filter) && { done: filter })
    }
  })

  const [newTitle, setNewTitle] = useState('')
  const [add, { isSuccess: addIsSuccess }] = useAddTodoMutation()
  const [del] = useDelTodoMutation()
  const [patch] = useUpdTodoMutation()

  const onDelClick: TodoProps['onDelClick'] = (e) => {
    const id = getTodoId(e)
    del({ json: { list_id: listId, id: Number(id) } })
  }

  const onAddEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') return

    const { value } = e.currentTarget
    const title = value.trim()

    if (title) {
      add({ json: { list_id: listId, title } })
    }
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value)
  }

  const onEditBlur: TodoProps['onEditBlur'] = (e) => {
    const id = getTodoId(e)
    const { value } = e.currentTarget
    patch({ json: { list_id: listId, id: Number(id), title: value.trim() } })
  }

  const onEditKeyDown: TodoProps['onEditKeyDown'] = (e) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur()
    }

    if (e.key === 'Enter') {
      const id = getTodoId(e)
      const { value } = e.currentTarget
      patch({ json: { list_id: listId, id: Number(id), title: value.trim() } })
      e.currentTarget.blur()
    }
  }

  const onDoneChange: TodoProps['onDoneChange'] = (e) => {
    const id = getTodoId(e)
    const { checked } = e.currentTarget

    patch({ json: { list_id: listId, id: Number(id), done: Number(checked) } })
  }

  useEffect(() => {
    if (addIsSuccess) {
      setNewTitle('')
    }
  }, [addIsSuccess])

  return (
    <div>
      <input
        className={s.addInput}
        type="text"
        value={newTitle}
        onKeyDown={onAddEnter}
        onChange={onTitleChange}
        placeholder="Add todo"
      />
      <div className={s.filters}>
        <button
          type="button"
          className={s.btn}
          onClick={() => setFilter('all')}
          disabled={filter === 'all'}
        >
          All
        </button>
        <button
          type="button"
          className={s.btn}
          onClick={() => setFilter('true')}
          disabled={filter === 'true'}
        >
          Done
        </button>
        <button
          type="button"
          className={s.btn}
          onClick={() => setFilter('false')}
          disabled={filter === 'false'}
        >
          Undone
        </button>
      </div>
      <ul className={s.todos}>
        {todos?.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onDelClick={onDelClick}
            onEditBlur={onEditBlur}
            onDoneChange={onDoneChange}
            onEditKeyDown={onEditKeyDown}
          />
        ))}
      </ul>
    </div>
  )
}
