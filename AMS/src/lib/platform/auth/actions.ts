'use server';
/**
 * Server Actions for authentication.
 * Call from Client Component form handlers.
 */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../db/server';
import type { ApiResponse, Database } from '../types';

export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { 
      data: null, 
      error: 'Invalid email or password. Please try again.', 
      status: 401 
    };
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  
  if (authError) {
    return { 
      data: null, 
      error: 'Unable to create account. Please try again.', 
      status: 400 
    };
  }

  // Create user profile row
  if (authData.user) {
    // Type-safe payload matching user_profiles.Insert shape
    type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
    const profilePayload: UserProfileInsert = {
      id: authData.user.id,
      full_name: fullName,
      timezone: 'Asia/Manila',
      locale: 'en-PH',
    };
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([profilePayload] as never);

    if (profileError) {
      // Profile creation failed but auth succeeded - log this but don't fail signup
      console.error('Failed to create user profile:', profileError);
    }
  }

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
  if (error) {
    return { 
      data: null, 
      error: 'Unable to send password reset email. Please check the email address and try again.', 
      status: 400 
    };
  }
  return { data: null, error: null, status: 200 };
}
