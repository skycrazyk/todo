import type { Todo } from '@app/backend'
import { useEffect, useRef } from 'react'

export function Todo({
  editId,
  todo: { id, title },
  onEditClick,
  onEditBlur,
  onDelClick
}: {
  todo: Todo
  editId: string
  onEditClick: React.MouseEventHandler<HTMLSpanElement>
  onEditBlur: React.FocusEventHandler<HTMLInputElement>
  onDelClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editId === String(id)) {
      inputRef.current?.focus()
    }
  }, [editId, id])

  return (
    <li>
      {editId === String(id) ? (
        <input
          ref={inputRef}
          data-id={id}
          defaultValue={title}
          onBlur={onEditBlur}
        />
      ) : (
        <span data-id={id} onClick={onEditClick}>
          {id} - {title}
        </span>
      )}
      <button type="button" data-id={id} onClick={onDelClick}>
        del
      </button>
    </li>
  )
}

export type TodoProps = React.ComponentProps<typeof Todo>
