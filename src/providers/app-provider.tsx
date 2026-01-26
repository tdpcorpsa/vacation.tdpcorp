'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useGetAppBySubdomain } from '@/hooks/apps/use-get-app-by-subdomain'
import { Tables } from '@/types/supabase.types'

type App = Tables<'apps'>

type AppContextType = {
  currentApp: App | null
  isLoading: boolean
  error: Error | null
}

const AppContext = createContext<AppContextType>({
  currentApp: null,
  isLoading: true,
  error: null,
})

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [subdomain, setSubdomain] = useState<string | null>(null)

  useEffect(() => {
    const hostname = window.location.hostname
    const domain = process.env.NEXT_PUBLIC_DOMAIN

    let sub = ''

    if (domain && hostname.endsWith(domain)) {
      // e.g. app.domain.com -> app
      const part = hostname.replace(`.${domain}`, '')
      if (part !== hostname) {
        sub = part
      }
    } else if (hostname.includes('localhost')) {
      // e.g. app.localhost -> app
      const parts = hostname.split('.')
      if (parts.length > 1 && parts[parts.length - 1] === 'localhost') {
        sub = parts[0]
      }
    }

    if (sub) {
      setSubdomain(sub)
    } else {
      // If no subdomain found, default to 'vacation' for development/local
      setSubdomain('vacation')
    }
  }, [])

  const { data: app, isLoading, error } = useGetAppBySubdomain(subdomain || '')

  return (
    <AppContext.Provider
      value={{
        currentApp: app ?? null,
        isLoading: isLoading && !!subdomain,
        error: error as Error | null,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
