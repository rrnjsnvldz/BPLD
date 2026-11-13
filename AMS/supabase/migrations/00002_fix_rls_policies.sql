-- Fix RLS Policies - Remove Circular Dependencies
-- Migration: 00002
-- Description: Remove admin policies that cause infinite recursion

-- Drop the problematic admin policies
DROP POLICY IF EXISTS user_profiles_admin_all ON public.user_profiles;
DROP POLICY IF EXISTS user_roles_admin_select ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_insert ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_delete ON public.user_roles;

-- Simplified approach: Use service role for admin operations
-- Users can only see their own data through the app
-- Admins will use service role key for admin operations (server-side only)

-- User Roles: Keep simple policies without circular checks
-- Users can view their own roles (no admin check = no recursion)
-- Insert/Delete operations will be done via service role (server-side)
