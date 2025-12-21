import { useEffect } from 'react'
import {
  useAddListMutation,
  useGetListsQuery,
  useUpdListMutation
} from '../../api.ts'
import { List, type ListProps } from '../list/List.tsx'
import { getListId, findListId } from './getListId.ts'
import s from './Lists.module.css'
import sList from '../list/List.module.css'
import { addListKey } from '../../common.ts'

export function Lists() {
  const { data: lists, isFetching: listIsFetching } = useGetListsQuery({})
  const [upd] = useUpdListMutation()

  const [, { isSuccess: addIsSuccess, reset: addIsReset }] = useAddListMutation(
    {
      fixedCacheKey: addListKey
    }
  )

  useEffect(() => {
    const id = lists?.[lists.length - 1]?.id

    if (listIsFetching || !addIsSuccess || !id) return

    findListId(id.toString())
      ?.querySelector<HTMLInputElement>(`.${sList.titleInput}`)
      ?.focus()

    addIsReset()
  }, [listIsFetching, addIsSuccess, addIsReset, lists])

  const onEditBlur: ListProps['onEditBlur'] = (e) => {
    const id = getListId(e)
    const { value } = e.currentTarget
    upd({ json: { id: Number(id), title: value.trim() } })
  }

  const onEditKeyDown: ListProps['onEditKeyDown'] = (e) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur()
    }

    if (e.key === 'Enter') {
      const id = getListId(e)
      const { value } = e.currentTarget
      upd({ json: { id: Number(id), title: value.trim() } })
      e.currentTarget.blur()
    }
  }

  return (
    <ul className={s.lists}>
      {lists?.map((list) => (
        <List
          list={list}
          key={list.id}
          onEditBlur={onEditBlur}
          onEditKeyDown={onEditKeyDown}
        />
      ))}
    </ul>
  )
}
