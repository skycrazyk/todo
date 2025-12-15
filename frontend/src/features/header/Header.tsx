import { UserButton } from '@clerk/clerk-react'
import s from './Header.module.css'

export function Header() {
  return (
    <header className={s.header}>
      <UserButton />
    </header>
  )
}
