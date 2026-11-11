/**
 * Dashboard Home Page
 * Protected page showing welcome message and user information
 */

import { requireAuth } from '@/lib/platform/auth/session'
import { createClient } from '@/lib/platform/db/server'
import { AppLayout } from '@/components/platform/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Shield } from 'lucide-react'

// Allow blocking route for authenticated pages
export const instant = false

/**
 * Format current date/time in Asia/Manila timezone
 */
function formatManilaDateTime(): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  return formatter.format(now)
}

export default async function DashboardPage() {
  // Require authentication - redirects to /login if not authenticated
  const user = await requireAuth()

  // Fetch user profile and roles
  const supabase = await createClient()
  
  type ProfileData = {
    full_name: string | null
    phone: string | null
  }
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .maybeSingle() as { data: ProfileData | null }

  const { data: userRolesData } = await supabase
    .from('user_roles')
    .select('role_id, roles(id, name, description)')
    .eq('user_id', user.id)

  interface UserRoleWithRole {
    role_id: number
    roles: {
      id: number
      name: string
      description: string | null
    } | null
  }

  const roles = (userRolesData as UserRoleWithRole[] || [])
    .map((ur) => ur.roles)
    .filter((r): r is NonNullable<typeof r> => r !== null)

  const userName = profile?.full_name || user.email || 'User'
  const currentDateTime = formatManilaDateTime()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Welcome back, {userName}!</CardTitle>
            <CardDescription>
              Here&apos;s what&apos;s happening with your autoshop today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Date/Time */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Current Date & Time</p>
                <p className="text-sm text-gray-600">{currentDateTime}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Full Name</p>
                <p className="text-sm text-gray-600">{userName}</p>
              </div>
            </div>

            {/* User Roles */}
            {roles.length > 0 && (
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Role(s)</p>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <Badge key={role.id} variant="secondary">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Placeholder */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Service Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">
                Coming&nbsp;soon
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today&apos;s Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">
                Coming&nbsp;soon
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">
                Coming&nbsp;soon
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">
                Coming&nbsp;soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
