import { Database } from '@/types/supabase.types'
import { createBrowserClient } from '@supabase/ssr'

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
  ? `.${process.env.NEXT_PUBLIC_DOMAIN}`
  : undefined

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: COOKIE_DOMAIN,
        path: '/',
        // secure: true sólo en HTTPS; en dev con http => false
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    }
  )
}

// Export a singleton instance for convenience
export const supabase = createClient()
