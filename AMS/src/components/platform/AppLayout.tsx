/**
 * AppLayout - Main application layout with sidebar navigation
 * Used by all authenticated pages
 */

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { PageHeader } from './PageHeader'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Page header */}
        {(title || subtitle) && (
          <PageHeader title={title} subtitle={subtitle} />
        )}

        {/* Page content */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
