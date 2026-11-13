'use server';
/**
 * Server Actions for role management.
 * Admin-only operations for assigning/removing user roles.
 */
import { revalidatePath } from 'next/cache';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type { ApiResponse, Database } from '../types';

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
 * Assign a role to a user.
 * @param userId - The user's ID
 * @param roleId - The role ID to assign
 */
export async function assignRole(
  userId: string,
  roleId: number
): Promise<ApiResponse<null>> {
  try {
    const supabase = createAdminClient();
    
    // Check if role assignment already exists
    const { data: existing } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .maybeSingle();
    
    if (existing) {
      return {
        data: null,
        error: 'User already has this role',
        status: 400,
      };
    }
    
    // Insert new role assignment
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
      } as never);
    
    if (error) {
      console.error('Error assigning role:', error);
      return {
        data: null,
        error: `Failed to assign role: ${error.message}`,
        status: 500,
      };
    }
    
    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);
    
    return {
      data: null,
      error: null,
      status: 200,
    };
  } catch (err) {
    console.error('Unexpected error assigning role:', err);
    return {
      data: null,
      error: 'An unexpected error occurred',
      status: 500,
    };
  }
}

/**
 * Remove a role from a user.
 * @param userId - The user's ID
 * @param roleId - The role ID to remove
 */
export async function removeRole(
  userId: string,
  roleId: number
): Promise<ApiResponse<null>> {
  try {
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);
    
    if (error) {
      console.error('Error removing role:', error);
      return {
        data: null,
        error: `Failed to remove role: ${error.message}`,
        status: 500,
      };
    }
    
    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${userId}`);
    
    return {
      data: null,
      error: null,
      status: 200,
    };
  } catch (err) {
    console.error('Unexpected error removing role:', err);
    return {
      data: null,
      error: 'An unexpected error occurred',
      status: 500,
    };
  }
}
