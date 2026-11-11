/**
 * Supabase session refresh helper for Next.js middleware.
 * Call this in src/middleware.ts to keep sessions alive.
 * 
 * DESIGN NOTE: Middleware enforces authentication only, not role-based authorization.
 * Role checks happen at the component level via requireRole(). This is intentional:
 * - Role data requires a database query (user_roles table)
 * - Middleware should be fast and not block on DB queries
 * - Role requirements vary per route and are best enforced at the Server Component level
 * - requireRole() provides clear error messages and redirects to /unauthorized
 * 
 * If you need edge-level role enforcement for high-security routes, consider adding
 * a role check here with user_roles cached in the session JWT claims.
 */
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '../types/database';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do NOT remove this await.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicPath = pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
