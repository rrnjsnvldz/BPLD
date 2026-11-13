/**
 * Sidebar - Main navigation sidebar
 * Shows navigation links, user profile, and sign out
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  Package, 
  CreditCard, 
  DollarSign, 
  Settings,
  LogOut,
  User,
  Loader2,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/platform/auth/actions'
import { useUser } from '@/lib/platform/auth/hooks'
import { showToast } from '@/lib/utils/toast'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Scheduling', href: '/scheduling', icon: Calendar },
  { name: 'Service Orders', href: '/service-orders', icon: ClipboardList },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'POS & Billing', href: '/pos', icon: CreditCard },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Users', href: '/admin/users', icon: Shield },
]

/**
 * Get initials from full name for avatar fallback.
 */
function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, roles, loading, error } = useUser()

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.error) {
      showToast.error(result.error)
    } else {
      showToast.success('You have been signed out')
      router.push('/login')
      router.refresh()
    }
  }

  // Get primary role (first role)
  const primaryRole = roles.length > 0 ? roles[0].name : 'User'
  
  // Check if user has Admin role (role_id = 1)
  const isAdmin = roles.some((role) => role.id === 1)

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-gray-900">
          JRS Bongabon AMS
        </h1>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        {/* Administration Section (Admin only) */}
        {isAdmin && (
          <>
            <Separator className="my-4" />
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </p>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User profile and dropdown */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">
            {error}
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-auto p-0 hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-3 px-3 py-2 w-full">
                  <Avatar>
                    {profile?.avatar_url && (
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
                    )}
                    <AvatarFallback>
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile?.full_name || user?.email || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {primaryRole}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
