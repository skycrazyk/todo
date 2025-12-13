import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store.ts'
import { Provider } from 'react-redux'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/clerk-react'

import './client.ts'
import { RequireToken } from './features/auth/RequireToken.tsx'
import { Lists } from './features/lists/Lists.tsx'
import './Main.css'
import { Greet } from './features/greet/Greet.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <SignedOut>
          <Greet />
        </SignedOut>
        <SignedIn>
          <RequireToken>
            <UserButton />
            <Lists />
          </RequireToken>
        </SignedIn>
      </Provider>
    </ClerkProvider>
  </StrictMode>
)
