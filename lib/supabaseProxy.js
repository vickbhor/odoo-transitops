// lib/supabase/proxy.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']

export async function updateSession(request) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          // Prevents a cached response leaking one user's session to another
          // once you deploy to Vercel in Hour 8.
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value)
          )
        },
      },
    }
  )

  // Nothing runs between createServerClient and getClaims() — this call
  // both refreshes the token and re-signs the cookie in one pass.
  const { data: { claims } } = await supabase.auth.getClaims()

  const { pathname } = request.nextUrl
  const isPublicPath = PUBLIC_PATHS.includes(pathname)

  if (!claims && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (claims && isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}