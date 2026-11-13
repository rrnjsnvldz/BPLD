/**
 * User Management - User List Page
 * Admin-only page showing all users with their roles
 */

import { requireRole } from '@/lib/platform/auth/session'
import { createClient } from '@/lib/platform/db/server'
import { RoleId } from '@/lib/platform/types'
import { AppLayout } from '@/components/platform/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserPlus, Eye } from 'lucide-react'
import Link from 'next/link'

/**
 * Get initials from full name for avatar fallback.
 */
function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

interface UserWithRoles {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  roles: Array<{
    id: number
    name: string
  }>
}

export default async function UsersPage() {
  // Require Admin role
  await requireRole(RoleId.Admin)

  const supabase = await createClient()

  // Fetch all users from auth.users (via user_profiles)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, full_name, avatar_url, created_at')
    .order('created_at', { ascending: false })

  type ProfileRow = {
    id: string
    full_name: string | null
    avatar_url: string | null
    created_at: string
  }

  // Get emails from auth.users
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers()

  // Fetch all user roles
  const { data: userRolesData } = await supabase
    .from('user_roles')
    .select('user_id, role_id, roles(id, name)')

  interface UserRoleWithRole {
    user_id: string
    role_id: number
    roles: {
      id: number
      name: string
    } | null
  }

  // Combine data
  const users: UserWithRoles[] = ((profiles || []) as ProfileRow[]).map((profile) => {
    const authUser = authUsers?.find((u) => u.id === profile.id)
    const roles = (userRolesData as UserRoleWithRole[] || [])
      .filter((ur) => ur.user_id === profile.id && ur.roles !== null)
      .map((ur) => ur.roles!)

    return {
      id: profile.id,
      email: authUser?.email || 'Unknown',
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      roles,
    }
  })

  return (
    <AppLayout title="User Management" subtitle="Manage user accounts and roles">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <Button asChild>
              <Link href="/admin/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.avatar_url && (
                            <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                          )}
                          <AvatarFallback>
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || 'Unnamed User'}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length === 0 ? (
                          <span className="text-sm text-muted-foreground">No roles</span>
                        ) : (
                          user.roles.map((role) => (
                            <Badge key={role.id} variant="secondary">
                              {role.name}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
