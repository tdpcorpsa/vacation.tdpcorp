'use client'

import { ReactNode } from 'react'
import usePerms from '@/hooks/auth/use-perms'
import Forbidden from '@/components/ui/forbidden'
import { useProfileContext } from '@/providers/profile-provider'
import { Spinner } from '@/components/ui/spinner'

interface ProtectPageProps {
  subdomain: string
  resource: string
  action: string
  children: ReactNode
}

export function ProtectPage({
  subdomain,
  resource,
  action,
  children,
}: ProtectPageProps) {
  const { canAccess } = usePerms()
  const { isLoading } = useProfileContext()
  const hasAccess = canAccess(subdomain, resource, action)

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!hasAccess) {
          return <Forbidden />
        }

  return <>{children}</>
}
