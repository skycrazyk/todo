export function getTodoId(e: React.SyntheticEvent) {
  const elem = e.currentTarget.closest('[data-item-id]')

  if (
    !(
      elem &&
      'dataset' in elem &&
      typeof elem.dataset === 'object' &&
      elem.dataset !== null &&
      'itemId' in elem.dataset &&
      typeof elem.dataset.itemId === 'string'
    )
  )
    throw new Error('Cannot find todo id in event target ancestors')

  return elem.dataset.itemId
}
