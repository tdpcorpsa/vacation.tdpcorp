import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN
  ? `.${process.env.NEXT_PUBLIC_DOMAIN}`
  : undefined

export async function updateSession(request: NextRequest, headers?: Headers) {
  let supabaseResponse = NextResponse.next({
    request,
    headers,
  })

  supabaseResponse.cookies.set('__test_domain', 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', // en dev HTTP => false
    ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
    path: '/',
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: COOKIE_DOMAIN,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const safe: CookieOptions = {
              ...options,
              ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
              secure:
                options?.secure ??
                (process.env.NODE_ENV === 'production' ? true : false),
              httpOnly: options?.httpOnly ?? true,
              sameSite:
                (options?.sameSite as CookieOptions['sameSite']) ?? 'lax',
              path: options?.path ?? '/',
            }
            supabaseResponse.cookies.set(name, value, safe)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return { supabaseResponse, user }
}
