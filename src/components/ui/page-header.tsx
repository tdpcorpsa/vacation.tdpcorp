'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from './sidebar'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  withSidebar?: boolean
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  withSidebar = true,
}: PageHeaderProps) {
  return (
    <header className={cn('p-4', className)}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {withSidebar && <SidebarTrigger />}
          <div>
            <h1 className="text-lg font-bold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions}
      </div>
    </header>
  )
}
