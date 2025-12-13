import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { client as c } from './client.ts'
import { tokenConfig } from './common.ts'

type Handler = (...args: any[]) => Promise<Response>
type Return<T extends Handler> = Awaited<
  ReturnType<Awaited<ReturnType<T>>['json']>
>
type Params<T extends Handler> = Parameters<T>[0]

function queryFn<M extends Handler>(method: M) {
  return async (param?: Parameters<M>[0]) => {
    try {
      const token = await Clerk?.session?.getToken(tokenConfig)

      const res = await method(param, {
        headers: {
          Authorization: `Bearer ${token}`
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

const Tags = {
  Todos: 'Todos',
  Lists: 'Lists'
} as const

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({}),
  tagTypes: Object.values(Tags),
  endpoints: (build) => ({
    // TODOS
    todos: build.query<
      Return<typeof c.todos.$get>,
      Params<typeof c.todos.$get>
    >({
      queryFn: queryFn(c.todos.$get),
      providesTags: (_r, _e, a) => [
        { type: Tags.Todos, id: a.query.list_id.toString() }
      ]
    }),
    // TODO
    addTodo: build.mutation<
      Return<typeof c.todo.$post>,
      Params<typeof c.todo.$post>
    >({
      queryFn: queryFn(c.todo.$post),
      invalidatesTags: (_r, _e, a) => [{ type: Tags.Todos, id: a.json.list_id }]
    }),
    delTodo: build.mutation<
      Return<typeof c.todo.$delete>,
      Params<typeof c.todo.$delete>
    >({
      queryFn: queryFn(c.todo.$delete),
      invalidatesTags: (_r, _e, a) => [{ type: Tags.Todos, id: a.json.list_id }]
    }),
    updTodo: build.mutation<
      Return<typeof c.todo.$patch>,
      Params<typeof c.todo.$patch>
    >({
      queryFn: queryFn(c.todo.$patch),
      invalidatesTags: (_r, _e, a) => [{ type: Tags.Todos, id: a.json.list_id }]
    }),
    // LIST
    addList: build.mutation<
      Return<typeof c.list.$post>,
      Params<typeof c.list.$post>
    >({
      queryFn: queryFn(c.list.$post),
      invalidatesTags: [Tags.Lists]
    }),
    delList: build.mutation<
      Return<typeof c.list.$delete>,
      Params<typeof c.list.$delete>
    >({
      queryFn: queryFn(c.list.$delete),
      invalidatesTags: [Tags.Lists]
    }),
    updList: build.mutation<
      Return<typeof c.list.$patch>,
      Params<typeof c.list.$patch>
    >({
      queryFn: queryFn(c.list.$patch),
      invalidatesTags: [Tags.Lists]
    }),
    // LISTS
    getLists: build.query<
      Return<typeof c.lists.$get>,
      Params<typeof c.lists.$get>
    >({
      queryFn: queryFn(c.lists.$get),
      providesTags: [Tags.Lists]
    })
  })
})

export const {
  useTodosQuery,
  useAddTodoMutation,
  useDelTodoMutation,
  useUpdTodoMutation,
  useAddListMutation,
  useGetListsQuery,
  useDelListMutation,
  useUpdListMutation
} = api
