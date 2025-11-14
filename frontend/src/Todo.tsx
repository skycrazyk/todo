import type { Todo } from '@app/backend'
import { useEffect, useRef } from 'react'
import './todo.css'

export function Todo({
  editId,
  todo: { id, title, done },
  onEditClick,
  onEditBlur,
  onEditKeyDown,
  onDelClick,
  onDoneChange
}: {
  todo: Todo
  editId: string
  onEditClick: React.MouseEventHandler<HTMLSpanElement>
  onEditBlur: React.FocusEventHandler<HTMLInputElement>
  onEditKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  onDelClick: React.MouseEventHandler<HTMLButtonElement>
  onDoneChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editId === String(id)) {
      inputRef.current?.focus()
    }
  }, [editId, id])

  return (
    <li
      className="todo"
      // TODO Брать id из li
      data-id={id}
    >
      <input
        type="checkbox"
        checked={done}
        data-id={id}
        onChange={onDoneChange}
      />
      {editId === String(id) ? (
        <input
          ref={inputRef}
          data-id={id}
          defaultValue={title}
          onBlur={onEditBlur}
          onKeyDown={onEditKeyDown}
        />
      ) : (
        <span data-id={id} onClick={onEditClick}>
          {id}: {title}
        </span>
      )}
      <button type="button" data-id={id} onClick={onDelClick}>
        X
      </button>
    </li>
  )
}

export type TodoProps = React.ComponentProps<typeof Todo>
