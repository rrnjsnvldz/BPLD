/**
 * Add User Page
 * Admin-only page for creating new user accounts
 */

import { requireRole } from '@/lib/platform/auth/session';
import { createClient } from '@/lib/platform/db/server';
import { RoleId } from '@/lib/platform/types';
import { AppLayout } from '@/components/platform/AppLayout';
import { UserCreateForm } from './UserCreateForm';

export default async function AddUserPage() {
  // Require Admin role - must be first
  await requireRole(RoleId.Admin);

  const supabase = await createClient();

  // Fetch available roles
  const { data: roles } = await supabase
    .from('roles')
    .select('*')
    .order('id');

  return (
    <AppLayout title="Add User" subtitle="Create a new user account">
      <UserCreateForm availableRoles={roles || []} />
    </AppLayout>
  );
}
