import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store.ts'
import { Provider } from 'react-redux'
import { List } from './features/list/List.tsx'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/clerk-react'

import './client.ts'
import { RequireToken } from './features/auth/RequireToken.tsx'
import { TestAuth } from './features/testAuth/TestAuth.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <RequireToken>
            <UserButton />
            <List />
            <TestAuth />
          </RequireToken>
        </SignedIn>
      </Provider>
    </ClerkProvider>
  </StrictMode>
)
