import { configureStore } from '@reduxjs/toolkit'
import { api } from './features/api/api.ts'
import { errorLogger } from './features/api/errorLogger.ts'

export const store = configureStore({
  reducer: {
    api: api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, errorLogger)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
