'use client'

export { SearchInput } from './search-input'
import { useQueryState, parseAsString } from 'nuqs'
export { applySupabaseSearch } from './generate-supabase-search'

export function useSearchQuery(param = 'q') {
  return useQueryState(param, parseAsString.withDefault(''))
}
