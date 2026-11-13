/**
 * PageHeader - Reusable page header component
 * Shows page title, subtitle, and optional action buttons
 */

import { ReactNode } from 'react'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="border-b bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h1 className="text-2xl font-semibold text-gray-900">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
