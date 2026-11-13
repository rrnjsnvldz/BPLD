/**
 * User Management - User Detail Page
 * Admin-only page showing individual user details and role management
 */

import { requireRole } from '@/lib/platform/auth/session'
import { createClient } from '@/lib/platform/db/server'
import { RoleId } from '@/lib/platform/types'
import { AppLayout } from '@/components/platform/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Phone, Calendar, Shield } from 'lucide-react'
import { notFound } from 'next/navigation'
import { UserRoleManager } from './UserRoleManager'

/**
 * Get initials from full name for avatar fallback.
 */
function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: PageProps) {
  // Require Admin role
  await requireRole(RoleId.Admin)

  const { id } = await params
  const supabase = await createClient()

  // Fetch user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  type ProfileRow = {
    id: string
    full_name: string | null
    avatar_url: string | null
    phone: string | null
    timezone: string
    locale: string
    created_at: string
    updated_at: string
  }

  if (!profile) {
    notFound()
  }

  const typedProfile = profile as ProfileRow

  // Get email from auth.users
  const { data: { user: authUser } } = await supabase.auth.admin.getUserById(id)

  if (!authUser) {
    notFound()
  }

  // Fetch user roles
  const { data: userRolesData } = await supabase
    .from('user_roles')
    .select('role_id, roles(id, name, description)')
    .eq('user_id', id)

  interface UserRoleWithRole {
    role_id: number
    roles: {
      id: number
      name: string
      description: string | null
    } | null
  }

  const userRoles = (userRolesData as UserRoleWithRole[] || [])
    .filter((ur) => ur.roles !== null)
    .map((ur) => ur.roles!)

  // Fetch all available roles
  const { data: allRoles } = await supabase
    .from('roles')
    .select('*')
    .order('id')

  return (
    <AppLayout title="User Details" subtitle="View and manage user information">
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {typedProfile.avatar_url && (
                  <AvatarImage src={typedProfile.avatar_url} alt={typedProfile.full_name || 'User'} />
                )}
                <AvatarFallback className="text-2xl">
                  {getInitials(typedProfile.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{typedProfile.full_name || 'Unnamed User'}</h3>
                <p className="text-sm text-muted-foreground">User ID: {id.slice(0, 8)}...</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{authUser.email || 'Not provided'}</p>
                </div>
              </div>

              {typedProfile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{typedProfile.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Account Created</p>
                  <p className="text-sm text-gray-600">
                    {new Date(typedProfile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Management Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Role Management</CardTitle>
            </div>
            <CardDescription>Assign or remove user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <UserRoleManager
              userId={id}
              currentRoles={userRoles}
              availableRoles={allRoles || []}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
