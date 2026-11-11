/**
 * Client-side auth hooks.
 * Use in Client Components only.
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../db/client'
import type { UserProfile, Role } from '../types'

interface UseUserResult {
  user: {
    id: string
    email: string | undefined
  } | null
  profile: UserProfile | null
  roles: Role[]
  loading: boolean
  error: string | null
}

/**
 * Fetches the current user profile and roles from Supabase.
 * Returns user, profile, roles, loading, and error states.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<{ id: string; email: string | undefined } | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchUser() {
      try {
        setLoading(true)
        setError(null)

        // Get current auth user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !authUser) {
          setUser(null)
          setProfile(null)
          setRoles([])
          setLoading(false)
          return
        }

        setUser({
          id: authUser.id,
          email: authUser.email,
        })

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileError) {
          console.error('Error fetching user profile:', profileError)
          setError('Failed to load user profile')
        } else {
          setProfile(profileData)
        }

        // Fetch user roles
        const { data: userRolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role_id, roles(id, name, description)')
          .eq('user_id', authUser.id)

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError)
          setError('Failed to load user roles')
        } else {
          // Extract roles from the join
          interface UserRoleWithRole {
            role_id: number
            roles: {
              id: number
              name: string
              description: string | null
            } | null
          }
          const rolesArray = (userRolesData as UserRoleWithRole[] || [])
            .map((ur) => ur.roles)
            .filter((r): r is NonNullable<typeof r> => r !== null)
          setRoles(rolesArray)
        }
      } catch (err) {
        console.error('Unexpected error fetching user:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, profile, roles, loading, error }
}
