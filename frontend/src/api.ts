import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Todo } from '@app/backend'
import { client } from './client.ts'

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['todos'],
  endpoints: (build) => ({
    todos: build.query<Todo[], void>({
      async queryFn() {
        try {
          const res = await client.todos.$get()
          const data = await res.json()
          return { data }
        } catch {
          return {
            error: {
              status: 500,
              statusText: 'Error',
              data: undefined
            }
          }
        }
      },
      providesTags: (r) => (r ? ['todos'] : [])
    }),
    add: build.mutation({
      async queryFn(title: string) {
        try {
          const res = await client.todo.$post({ json: { title } })
          const data = await res.json()
          return { data }
        } catch {
          return {
            error: {
              status: 500,
              statusText: 'Error',
              data: undefined
            }
          }
        }
      },
      invalidatesTags: ['todos']
    }),
    del: build.mutation({
      async queryFn(id: number) {
        try {
          const res = await client.todo.$delete({ json: { id } })
          const data = await res.json()
          return { data }
        } catch {
          return {
            error: {
              status: 500,
              statusText: 'Error',
              data: undefined
            }
          }
        }
      },
      invalidatesTags: ['todos']
    }),
    patch: build.mutation({
      async queryFn(props: Parameters<typeof client.todo.$patch>[0]['json']) {
        try {
          const res = await client.todo.$patch({ json: props })
          const data = await res.json()
          return { data }
        } catch {
          return {
            error: {
              status: 500,
              statusText: 'Error',
              data: undefined
            }
          }
        }
      },
      invalidatesTags: ['todos']
    })
  })
})

export const {
  useTodosQuery,
  useAddMutation,
  useDelMutation,
  usePatchMutation
} = api
