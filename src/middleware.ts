import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

function requestOrigin(req: NextRequest) {
  const xfProto = req.headers.get('x-forwarded-proto')
  const xfHost = req.headers.get('x-forwarded-host')
  const host = req.headers.get('host')
  const proto = xfProto ?? req.nextUrl.protocol.replace(':', '') ?? 'http'
  const pathname = req.nextUrl.pathname
  const search = req.nextUrl.search
  return `${proto}://${xfHost ?? host}${pathname}${search}`
}

export async function middleware(request: NextRequest) {
  // Update session and refresh tokens
  const headers = new Headers()
  const currentUlr = requestOrigin(request)
  headers.append('x-current-url', currentUlr)
  const { supabaseResponse } = await updateSession(request, headers)
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
