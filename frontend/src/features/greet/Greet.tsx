import { SignInButton } from '@clerk/clerk-react'
import s from './Greet.module.css'

export function Greet() {
  return (
    <div className={s.greet}>
      <div>
        <h1>Amazing todo lists 📋</h1>
        <SignInButton>Try now!</SignInButton>
      </div>
    </div>
  )
}
