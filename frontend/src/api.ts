import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { client as c } from './client.ts'
import { tokenManager } from './features/auth/tokenManager.ts'

type Handler = (...args: any[]) => Promise<Response>
type Return<T extends Handler> = Awaited<
  ReturnType<Awaited<ReturnType<T>>['json']>
>
type Params<T extends Handler> = Parameters<T>[0]

function queryFn<M extends Handler>(method: M) {
  return async (param?: Parameters<M>[0]) => {
    try {
      const res = await method(param, {
        headers: {
          Authorization: `Bearer ${tokenManager.token}`
        }
      })

      const data = (await res.json()) as Awaited<
        ReturnType<Awaited<ReturnType<M>>['json']>
      >

      return { data }
    } catch {
      return {
        // TODO придумать что-то получше
        error: {
          status: 500,
          statusText: 'Internal Server Error',
          data: undefined
        }
      }
    }
  }
}

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({}),
  tagTypes: ['todos'],
  endpoints: (build) => ({
    todos: build.query<
      Return<typeof c.todos.$get>,
      Params<typeof c.todos.$get>
    >({
      queryFn: queryFn(c.todos.$get),
      providesTags: (r) => (r ? ['todos'] : [])
    }),
    auth: build.query<Return<typeof c.auth.$get>, Params<typeof c.auth.$get>>({
      queryFn: queryFn(c.auth.$get)
    }),
    add: build.mutation<
      Return<typeof c.todo.$post>,
      Params<typeof c.todo.$post>
    >({
      queryFn: queryFn(c.todo.$post),
      invalidatesTags: ['todos']
    }),
    del: build.mutation<
      Return<typeof c.todo.$delete>,
      Params<typeof c.todo.$delete>
    >({
      queryFn: queryFn(c.todo.$delete),
      invalidatesTags: ['todos']
    }),
    patch: build.mutation<
      Return<typeof c.todo.$patch>,
      Params<typeof c.todo.$patch>
    >({
      queryFn: queryFn(c.todo.$patch),
      invalidatesTags: ['todos']
    })
  })
})

export const {
  useTodosQuery,
  useAddMutation,
  useDelMutation,
  usePatchMutation,
  useAuthQuery
} = api
