import { BrowserClerk } from '@clerk/clerk-react'

declare global {
  const Clerk: BrowserClerk | undefined
}
