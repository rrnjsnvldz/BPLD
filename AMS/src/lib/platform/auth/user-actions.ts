'use server';
/**
 * Server Actions for user management.
 * Admin-only operations for creating and managing user accounts.
 */
import { revalidatePath } from 'next/cache';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { ApiResponse, Database } from '../types';
import type { CreateUserInput } from './schemas';

/**
 * Create a Supabase client with service role (bypassing RLS).
 * Only use for admin operations where RLS needs to be bypassed.
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createServiceClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create a new user account with profile and roles.
 * @param data - User creation data including credentials and role assignments
 */
export async function createUser(
  data: CreateUserInput
): Promise<ApiResponse<{ userId: string }>> {
  try {
    const supabase = createAdminClient();
    
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    
    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return {
        data: null,
        error: authError?.message || 'Failed to create user',
        status: 500,
      };
    }
    
    const userId = authData.user.id;
    
    // Step 2: Insert user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        full_name: data.full_name,
        phone: data.phone || null,
      } as never);
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Try to clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(userId);
      return {
        data: null,
        error: `Failed to create user profile: ${profileError.message}`,
        status: 500,
      };
    }
    
    // Step 3: Insert role assignments
    const roleInserts = data.role_ids.map((role_id) => ({
      user_id: userId,
      role_id,
    }));
    
    const { error: rolesError } = await supabase
      .from('user_roles')
      .insert(roleInserts as never);
    
    if (rolesError) {
      console.error('Error assigning roles:', rolesError);
      // Try to clean up auth user and profile if role assignment fails
      await supabase.from('user_profiles').delete().eq('id', userId);
      await supabase.auth.admin.deleteUser(userId);
      return {
        data: null,
        error: `Failed to assign roles: ${rolesError.message}`,
        status: 500,
      };
    }
    
    // Revalidate user list page
    revalidatePath('/admin/users');
    
    return {
      data: { userId },
      error: null,
      status: 200,
    };
  } catch (err) {
    console.error('Unexpected error creating user:', err);
    return {
      data: null,
      error: 'An unexpected error occurred',
      status: 500,
    };
  }
}
