export function createGetDataId(dataAttr: string) {
  const getDataId = function getDataId(e: React.SyntheticEvent) {
    const elem = e.currentTarget.closest(`[data-${dataAttr}]`)
    const dataset = elem && 'dataset' in elem && elem.dataset

    if (
      !(
        elem &&
        'dataset' in elem &&
        typeof dataset === 'object' &&
        dataset !== null &&
        dataAttr in dataset &&
        typeof (dataset as Record<string, unknown>)[dataAttr] === 'string'
      )
    )
      throw new Error('Cannot find todo id in event target ancestors')

    return (dataset as Record<string, string>)[dataAttr]
  }

  const findDataId = function findDataId(id: string) {
    return document.querySelector(`[data-${dataAttr}="${id}"]`)
  }

  return [getDataId, findDataId] as const
}
