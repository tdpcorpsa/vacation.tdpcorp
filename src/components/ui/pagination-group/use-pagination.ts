import { parseAsInteger, useQueryState } from 'nuqs'

const DEFAULT_PAGE_SIZE = 20

interface UsePaginationOptions {
  queryKey?: string
  pageSizeQueryKey?: string
  defaultPage?: number
  defaultPageSize?: number
  shallow?: boolean
  history?: 'push' | 'replace'
}

export function usePagination({
  queryKey = 'page',
  pageSizeQueryKey = 'pageSize',
  defaultPage = 1,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  shallow = false,
  history = 'push',
}: UsePaginationOptions = {}) {
  const [page, setPage] = useQueryState(
    queryKey,
    parseAsInteger.withDefault(defaultPage).withOptions({
      history,
      shallow,
    })
  )
  const [pageSize, setPageSize] = useQueryState(
    pageSizeQueryKey,
    parseAsInteger.withDefault(defaultPageSize).withOptions({
      history,
      shallow,
    })
  )

  return {
    page: page || defaultPage,
    setPage,
    pageSize: pageSize || defaultPageSize,
    setPageSize,
  }
}
