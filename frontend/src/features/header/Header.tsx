import { UserButton } from '@clerk/clerk-react'
import s from './Header.module.css'
import { useAddListMutation } from '../api/api.ts'
import { addListKey } from '../../common.ts'

export function Header() {
  const [add] = useAddListMutation({ fixedCacheKey: addListKey })

  return (
    <header className={s.header}>
      <UserButton />
      <button type="button" onClick={() => add({ json: {} })}>
        + Add list
      </button>
    </header>
  )
}
