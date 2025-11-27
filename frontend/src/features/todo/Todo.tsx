import type { Todo } from '@app/backend'
import { useEffect, useRef } from 'react'
import './Todo.css'

export function Todo({
  todo: { id, title, done },
  onEditClick,
  onEditBlur,
  onEditKeyDown,
  onDelClick,
  onDoneChange
}: {
  todo: Todo
  onEditClick: React.MouseEventHandler<HTMLSpanElement>
  onEditBlur: React.FocusEventHandler<HTMLInputElement>
  onEditKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined
  onDelClick: React.MouseEventHandler<HTMLButtonElement>
  onDoneChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (onEditKeyDown) {
      inputRef.current?.focus()
    }
  }, [onEditKeyDown])

  return (
    <li className="todo" data-item-id={id}>
      <input type="checkbox" checked={done} onChange={onDoneChange} />
      {onEditKeyDown ? (
        <input
          ref={inputRef}
          defaultValue={title}
          onBlur={onEditBlur}
          onKeyDown={onEditKeyDown}
        />
      ) : (
        <span onClick={onEditClick}>
          {id}: {title}
        </span>
      )}
      <button type="button" onClick={onDelClick}>
        X
      </button>
    </li>
  )
}

export type TodoProps = React.ComponentProps<typeof Todo>
