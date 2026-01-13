import { Database } from '@/types/supabase.types'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
  ? `.${process.env.NEXT_PUBLIC_DOMAIN}`
  : undefined

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: COOKIE_DOMAIN,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const safeOpts: CookieOptions = {
                ...options,
                ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
                secure:
                  options?.secure ??
                  (process.env.NODE_ENV === 'production' ? true : false),
                httpOnly: options?.httpOnly ?? true,
                sameSite:
                  (options?.sameSite as CookieOptions['sameSite']) ?? 'lax',
                path: options?.path ?? '/', // <- importante
              }
              cookieStore.set(name, value, safeOpts)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
