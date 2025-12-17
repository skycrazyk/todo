import type { Todo } from '@app/backend'
import { useEffect, useRef } from 'react'
import s from './Todo.module.css'

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
    <li className={s.todo} data-itemid={id}>
      <input
        type="checkbox"
        checked={done}
        onChange={onDoneChange}
        className={s.done}
      />
      <input
        type="text"
        ref={inputRef}
        defaultValue={title}
        onBlur={onEditBlur}
        onKeyDown={onEditKeyDown}
        readOnly={!onEditKeyDown}
        onClick={onEditClick}
        className={s.title}
      />
      <button type="button" onClick={onDelClick} className={s.del}>
        X
      </button>
    </li>
  )
}

export type TodoProps = React.ComponentProps<typeof Todo>
