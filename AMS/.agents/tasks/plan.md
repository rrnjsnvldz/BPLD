# Implementation Plan: JVS Autoworks Brand & User Creation

This plan implements the 5-part UI sprint: brand colors, JVS logo, navigation update, user creation module, and polish/accessibility.

---

## PART 1 — Brand Colors on Existing Components

- [ ] 1. Update Button component with brand color variants.
      Modify src/components/ui/button.tsx buttonVariants: default variant → `bg-primary-500 text-white shadow hover:bg-primary-600 focus-visible:ring-primary-500`, secondary → `bg-secondary-500 text-white shadow-sm hover:bg-secondary-600`, destructive → `bg-primary-700 text-white shadow-sm hover:bg-primary-800`, outline → `border border-primary-500 text-primary-500 bg-background shadow-sm hover:bg-primary-50`, ghost → `text-primary-500 hover:bg-primary-50 hover:text-primary-600`.
      Files: src/components/ui/button.tsx
      Verify: `npm run build` completes without errors, then `npm run dev` and visually check all button variants across the app show correct brand colors.

- [ ] 2. Apply brand colors to Sidebar navigation.
      Update src/components/platform/Sidebar.tsx: main container `bg-navy-800` and `text-white`, active link `bg-primary-500/20 text-primary-300 border-l-2 border-primary-500`, inactive link `text-gray-300`, hover state `hover:bg-navy-700 hover:text-white`, section labels (Administration) `text-gray-400`, bottom user area `bg-navy-900 border-t border-navy-700`, user name `text-white`, user role `text-gray-400`, avatar fallback `bg-secondary-500 text-white`.
      Files: src/components/platform/Sidebar.tsx
      Verify: `npm run dev` and visually confirm sidebar has Navy background, white text, Racing Red active link indicator, Steel Blue avatar fallback.

- [ ] 3. Apply brand colors to Dashboard page.
      Update src/app/page.tsx: keep Card default white background, icons `text-gray-500`, card title labels `text-gray-700`, card description/values `text-gray-600`, role Badge components use `variant="secondary"` (will render Steel Blue after step 1).
      Files: src/app/page.tsx
      Verify: `npm run dev`, navigate to dashboard at http://localhost:3000, confirm role badges are Steel Blue (secondary-500).

- [ ] 4. Apply brand colors to Admin Users list page.
      Update src/app/admin/users/page.tsx: TableHeader `bg-navy-800 text-white`, TableRow normal rows `bg-white` alternating with `even:bg-gray-50`, Admin role Badge `bg-primary-500 text-white`, other role Badges `bg-secondary-100 text-secondary-700`, View button `variant="outline"` (will show primary-500 border after step 1).
      Files: src/app/admin/users/page.tsx
      Verify: `npm run dev`, login as admin, navigate to /admin/users, confirm table header is Navy, Admin badges are Racing Red, other role badges are light Steel Blue.

- [ ] 5. Apply brand colors to Login page.
      Update src/app/(auth)/login/page.tsx: outer container `bg-gray-50`, Card default white, primary Button remove explicit color classes (inherits default variant = primary-500 from step 1), links `text-secondary-500 hover:text-secondary-600`, error box `bg-primary-50 border border-primary-200 text-primary-800`, input focus states `focus:ring-primary-500 focus:border-primary-500`, email input add `autocomplete="email"`, password input add `autocomplete="current-password"`.
      Files: src/app/(auth)/login/page.tsx
      Verify: `npm run dev`, navigate to /login, confirm Racing Red sign-in button, Steel Blue register link, Racing Red error box if triggered.

- [ ] 6. Apply brand colors to Register page.
      Update src/app/(auth)/register/page.tsx: same pattern as login — `bg-gray-50` container, links `text-secondary-500 hover:text-secondary-600`, error box `bg-primary-50 border border-primary-200 text-primary-800`, success box keep `bg-green-50` (unchanged), primary Button inherits default variant, inputs add autocomplete: email `autocomplete="email"`, password `autocomplete="new-password"`, fullName `autocomplete="name"`.
      Files: src/app/(auth)/register/page.tsx
      Verify: `npm run dev`, navigate to /register, confirm Racing Red button, Steel Blue links, autocomplete attributes in DevTools.

---

## PART 2 — JVS Logo Component

- [ ] 7. Create JVSLogo SVG component with chrome gradient and racing stripes.
      Create src/components/brand/JVSLogo.tsx: export React component with props `{size: 'sm'|'md'|'lg'|'xl', variant: 'full'|'icon'}`. Map sizes: sm=32px, md=48px, lg=64px, xl=96px. Render inline SVG with `<linearGradient id="chromeGradient">` with stops: 0% #C0C0C0, 50% #989898, 100% #585858. Icon variant: 'JVS' text/letters with gradient fill. Full variant: icon + 'AUTOWORKS' text in gray-700 + 'JVS Bongabon' tagline in gray-600 text-sm + two racing stripes (horizontal lines): one stroke=#950304 (Racing Red) and one stroke=#446A91 (Steel Blue), each 2px thick.
      Files: src/components/brand/JVSLogo.tsx (new file)
      Verify: `npm run build` and confirm no TypeScript errors, temporarily add `<JVSLogo size="md" variant="full" />` to dashboard and verify chrome gradient and racing stripes render correctly in browser.

---

## PART 3 — Navigation Update (Sidebar)

- [ ] 8. Replace Sidebar title with JVSLogo component and add aria-current attributes.
      Update src/components/platform/Sidebar.tsx: import JVSLogo from '@/components/brand/JVSLogo'. Replace plain text 'JRS Bongabon AMS' with: `<div className="hidden md:flex"><JVSLogo size="md" variant="full" /></div>` for desktop and `<div className="flex md:hidden"><JVSLogo size="sm" variant="icon" /></div>` for mobile. Add `aria-current={isActive ? 'page' : undefined}` attribute to each Link component in navigation and adminNavigation maps. Increase active link left border from `border-l-2` to `border-l-4` for better visibility.
      Files: src/components/platform/Sidebar.tsx
      Verify: `npm run build` and `npm run lint` pass, then `npm run dev` and resize browser window to verify logo switches from full to icon at md breakpoint (~768px), click navigation links and confirm active link has red left border and aria-current="page" in DevTools.

---

## PART 4 — User Creation (Module K)

- [ ] 9. Create Zod schema for user creation input.
      Create src/lib/platform/auth/schemas.ts: export `createUserSchema` with `z.object({ full_name: z.string().min(2, 'Name must be at least 2 characters'), email: z.string().email('Invalid email format'), phone: z.string().nullable().optional(), password: z.string().min(8, 'Password must be at least 8 characters'), role_ids: z.array(z.number()).min(1, 'At least one role is required') })`. Export type `CreateUserInput = z.infer<typeof createUserSchema>`.
      Files: src/lib/platform/auth/schemas.ts (new file)
      Verify: `npm run build` and confirm schema file compiles without errors.

- [ ] 10. Create server action for user creation.
      Create src/lib/platform/auth/user-actions.ts: import createAdminClient pattern from role-actions.ts, import types. Export `async function createUser(data: CreateUserInput): Promise<ApiResponse<{ userId: string }>>`. Implementation: 1) `const supabase = createAdminClient()`, 2) `const { data: authData, error: authError } = await supabase.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true })`, 3) if authError return error response, 4) `const userId = authData.user.id`, 5) insert into user_profiles `{ id: userId, full_name: data.full_name, phone: data.phone }`, 6) for each roleId in data.role_ids insert into user_roles `{ user_id: userId, role_id: roleId }`, 7) `revalidatePath('/admin/users')`, 8) return success with userId. Wrap all in try/catch returning 500 error on exception.
      Files: src/lib/platform/auth/user-actions.ts (new file)
      Verify: `npm run build` and confirm user-actions.ts compiles without errors.

- [ ] 11. Create Add User page (Server Component wrapper).
      Create src/app/admin/users/new/page.tsx: import requireRole, RoleId, createClient, AppLayout. Add `await requireRole(RoleId.Admin)` at top. Fetch available roles: `const { data: roles } = await supabase.from('roles').select('*').order('id')`. Return `<AppLayout title="Add User" subtitle="Create a new user account"><UserCreateForm availableRoles={roles || []} /></AppLayout>`.
      Files: src/app/admin/users/new/page.tsx (new file)
      Verify: `npm run build` and confirm page.tsx compiles without errors.

- [ ] 12. Create Add User form (Client Component).
      Create src/app/admin/users/new/UserCreateForm.tsx: 'use client' component with props `{availableRoles: Role[]}`. Use react-hook-form with `zodResolver(createUserSchema.extend({ confirmPassword: z.string() }).refine(data => data.password === data.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] }))`. Form fields: Full Name (Input), Email (Input type="email" autocomplete="email"), Phone (Input type="tel" autocomplete="tel" optional), Password (Input type="password" autocomplete="new-password"), Confirm Password (Input type="password" autocomplete="new-password"), Roles (checkboxes for each availableRole mapped with register('role_ids')). onSubmit: call createUser action, if success `showToast.success('User created successfully')` and `router.push('/admin/users')`, if error `showToast.error(result.error)`. Loading state: `isPending` disables all inputs and submit button shows Loader2 spinner. Cancel button: `<Button variant="outline" asChild><Link href="/admin/users">Cancel</Link></Button>`. Card wrapper with white bg.
      Files: src/app/admin/users/new/UserCreateForm.tsx (new file)
      Verify: `npm run build` and confirm form compiles, then `npm run dev`, login as admin, navigate to /admin/users/new, test form validation (empty submit, mismatched passwords, valid submission), confirm user creation works end-to-end.

---

## PART 5 — Polish

- [ ] 13. Add horizontal scroll to admin users table for mobile.
      Update src/app/admin/users/page.tsx: wrap the `<Table>` component with `<div className="overflow-x-auto"><Table>...</Table></div>` to enable horizontal scrolling on small screens.
      Files: src/app/admin/users/page.tsx
      Verify: `npm run dev`, navigate to /admin/users, resize browser to mobile width (~375px), confirm table scrolls horizontally.

- [ ] 14. Create React Error Boundary component.
      Create src/components/platform/ErrorBoundary.tsx: React class component with state `{ hasError: boolean, error: Error | null }`. Implement `static getDerivedStateFromError(error) { return { hasError: true, error } }`. In render: if hasError return error UI with Card showing 'Something went wrong', error.message, and `<Button onClick={() => window.location.reload()}>Reload Page</Button>`. Otherwise return this.props.children. Export as ErrorBoundary.
      Files: src/components/platform/ErrorBoundary.tsx (new file)
      Verify: `npm run build` and confirm ErrorBoundary compiles without errors.

- [ ] 15. Integrate Error Boundary into AppLayout.
      Update src/components/platform/AppLayout.tsx: import ErrorBoundary, wrap the `<main>` children with `<ErrorBoundary>{children}</ErrorBoundary>`.
      Files: src/components/platform/AppLayout.tsx
      Verify: `npm run build` passes, then `npm run dev` and temporarily throw an error in a page component to confirm error boundary catches it and shows friendly error message instead of white screen.

- [ ] 16. Verify all auth form inputs have autocomplete attributes.
      Check src/app/(auth)/login/page.tsx (should have autocomplete="email" and autocomplete="current-password" from step 5) and src/app/(auth)/register/page.tsx (should have autocomplete="email", autocomplete="new-password", autocomplete="name" from step 6). If any are missing, add them.
      Files: src/app/(auth)/login/page.tsx, src/app/(auth)/register/page.tsx (verify only, edits in steps 5 & 6)
      Verify: `npm run dev`, open /login and /register in browser, inspect inputs in DevTools and confirm all have autocomplete attributes.

- [ ] 17. Verify async Server Components handle null from maybeSingle().
      Review src/app/page.tsx: confirm `const userName = profile?.full_name || user.email || 'User'` handles null profile. Review src/app/admin/users/[id]/page.tsx: confirm `if (!profile) { notFound() }` handles null. No changes needed if already present.
      Files: src/app/page.tsx, src/app/admin/users/[id]/page.tsx (verify only, likely already correct)
      Verify: `npm run build` passes, `npm run dev` and test dashboard and user detail pages load without crashing.

- [ ] 18. Final verification - build, lint, and manual testing.
      Run `npm run build` and confirm exit code 0. Run `npm run lint` and confirm exit code 0. Run `npm run dev` and perform full manual test: 1) Navigate through all pages (dashboard, admin users, login, register) and verify brand colors applied correctly, 2) Test logo responsiveness in sidebar, 3) Test user creation form end-to-end, 4) Resize to mobile and confirm table scrolls, 5) Open DevTools Accessibility panel and scan for major violations, 6) Confirm no console errors or warnings.
      Files: All files from previous steps
      Verify: All verification steps above pass, no errors in console, app functions correctly with new brand and features.

---

## Summary

**Total Steps:** 18  
**New Files:** 6 (JVSLogo.tsx, schemas.ts, user-actions.ts, new/page.tsx, UserCreateForm.tsx, ErrorBoundary.tsx)  
**Modified Files:** 9 (button.tsx, Sidebar.tsx, page.tsx, admin users pages, login.tsx, register.tsx, AppLayout.tsx)  
**Dependencies:** All required packages already installed (react-hook-form, zod, @hookform/resolvers confirmed in package.json)

**Key Verification Commands:**
- Build: `npm run build` (must pass with exit code 0)
- Lint: `npm run lint` (must pass with exit code 0)
- Dev server: `npm run dev` (manual testing at http://localhost:3000)

**Critical Success Factors:**
1. Brand colors consistently applied across all components
2. JVS logo renders with chrome gradient and racing stripes correctly
3. User creation form validates and creates users successfully
4. All pages responsive and accessible
5. No TypeScript, build, or lint errors
