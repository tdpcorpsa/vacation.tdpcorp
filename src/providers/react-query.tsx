'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 60 seconds before it becomes stale
      staleTime: 1000 * 60,
      // Automatically retry failed requests up to 3 times
      retry: 3,
    },
  },
})

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
