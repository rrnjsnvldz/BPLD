/**
 * User Role Manager Component
 * Client component for managing user roles with toast notifications
 */

'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus, Loader2 } from 'lucide-react'
import { assignRole, removeRole } from '@/lib/platform/auth/role-actions'
import { showToast } from '@/lib/utils/toast'
import { useRouter } from 'next/navigation'

interface Role {
  id: number
  name: string
  description: string | null
}

interface UserRoleManagerProps {
  userId: string
  currentRoles: Role[]
  availableRoles: Role[]
}

export function UserRoleManager({
  userId,
  currentRoles,
  availableRoles,
}: UserRoleManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [removingRoleId, setRemovingRoleId] = useState<number | null>(null)

  // Get roles that are not yet assigned
  const unassignedRoles = availableRoles.filter(
    (role) => !currentRoles.some((cr) => cr.id === role.id)
  )

  const handleAssignRole = async () => {
    if (!selectedRoleId) return

    const roleId = parseInt(selectedRoleId, 10)
    const roleName = availableRoles.find((r) => r.id === roleId)?.name || 'Role'

    startTransition(async () => {
      const result = await assignRole(userId, roleId)

      if (result.error) {
        showToast.error(result.error)
      } else {
        showToast.success(`${roleName} role assigned successfully`)
        setSelectedRoleId('')
        router.refresh()
      }
    })
  }

  const handleRemoveRole = async (roleId: number, roleName: string) => {
    setRemovingRoleId(roleId)

    startTransition(async () => {
      const result = await removeRole(userId, roleId)

      if (result.error) {
        showToast.error(result.error)
      } else {
        showToast.success(`${roleName} role removed successfully`)
        router.refresh()
      }

      setRemovingRoleId(null)
    })
  }

  return (
    <div className="space-y-4">
      {/* Current Roles */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Current Roles</p>
        {currentRoles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No roles assigned</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {currentRoles.map((role) => (
              <Badge key={role.id} variant="secondary" className="pr-1">
                {role.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                  onClick={() => handleRemoveRole(role.id, role.name)}
                  disabled={isPending}
                >
                  {removingRoleId === role.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Assign New Role */}
      {unassignedRoles.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Assign New Role</p>
          <div className="flex gap-2">
            <Select
              value={selectedRoleId}
              onValueChange={setSelectedRoleId}
              disabled={isPending}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                {unassignedRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                    {role.description && (
                      <span className="text-xs text-muted-foreground ml-2">
                        — {role.description}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedRoleId || isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Assign
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
