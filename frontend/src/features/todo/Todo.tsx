import type { Todo } from '@app/backend'
import s from './Todo.module.css'

export function Todo({
  todo: { id, title, done },
  onEditBlur,
  onEditKeyDown,
  onDelClick,
  onDoneChange
}: {
  todo: Todo
  onEditBlur: React.FocusEventHandler<HTMLInputElement>
  onEditKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  onDelClick: React.MouseEventHandler<HTMLButtonElement>
  onDoneChange: React.ChangeEventHandler<HTMLInputElement>
}) {
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
        defaultValue={title}
        onBlur={onEditBlur}
        onKeyDown={onEditKeyDown}
        className={s.title}
      />
      <button type="button" onClick={onDelClick} className={s.del}>
        X
      </button>
    </li>
  )
}

export type TodoProps = React.ComponentProps<typeof Todo>
