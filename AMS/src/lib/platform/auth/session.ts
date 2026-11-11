/**
 * Server-side session and role utilities.
 * Use in Server Components, Server Actions, and Route Handlers only.
 */
import { redirect } from 'next/navigation';
import { createClient } from '../db/server';
import type { AuthUser, RoleId } from '../types';

/** Returns the current Supabase session, or null if unauthenticated. */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/** Returns the current authenticated user with roles, or null. */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id);

  return {
    id: user.id,
    email: user.email,
    roles: (userRoles ?? []).map((r: { role_id: number }) => r.role_id as RoleId),
  };
}

/** Returns the role IDs assigned to the current user. */
export async function getUserRoles(): Promise<RoleId[]> {
  const user = await getUser();
  return user?.roles ?? [];
}

/** Returns true if the current user has the given role. */
export async function hasRole(roleId: RoleId): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.includes(roleId);
}

/**
 * Asserts the user is authenticated.
 * Redirects to /login if not.
 * 
 * IMPORTANT: Call this FIRST in your Server Component, before any database queries
 * or data fetching. Calling it after queries will still execute those queries before
 * the redirect happens, which could leak data in logs or create timing side-channels.
 * 
 * @example
 * // ✓ Correct — auth check first
 * export default async function ProtectedPage() {
 *   const user = await requireAuth();
 *   const data = await fetchSensitiveData();
 *   return <div>...</div>;
 * }
 * 
 * @example
 * // ✗ Wrong — query executes before auth check
 * export default async function ProtectedPage() {
 *   const data = await fetchSensitiveData(); // ← runs even if unauthenticated
 *   const user = await requireAuth();
 *   return <div>...</div>;
 * }
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

/**
 * Asserts the user has at least one of the given roles.
 * Redirects to /unauthorized if the role check fails.
 */
export async function requireRole(...roleIds: RoleId[]): Promise<AuthUser> {
  const user = await requireAuth();
  const hasAny = roleIds.some((r) => user.roles.includes(r));
  if (!hasAny) redirect('/unauthorized');
  return user;
}
