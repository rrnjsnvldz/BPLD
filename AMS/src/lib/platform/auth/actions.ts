'use server';
/**
 * Server Actions for authentication.
 * Call from Client Component form handlers.
 */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../db/server';
import type { ApiResponse } from '../types';

export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: error.message, status: 401 };
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { data: null, error: error.message, status: 400 };
  return { data: null, error: null, status: 200 };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function resetPassword(
  email: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/update-password`,
  });
  if (error) return { data: null, error: error.message, status: 400 };
  return { data: null, error: null, status: 200 };
}
