'use client'

import usePerms from '@/hooks/auth/use-perms'
import Forbidden, { ForbiddenProps } from './forbidden'
import { useProfileContext } from '@/providers/profile-provider'
import { Spinner } from './spinner'

type CanAccessProps = {
  subdomain: string
  resource: string
  action: string
} & ForbiddenProps

export default function CanAccess({
  subdomain,
  resource,
  action,
  variant,
  children,
}: CanAccessProps) {
  const { canAccess } = usePerms()
  const { isLoading } = useProfileContext()
  const hasAccess = canAccess(subdomain, resource, action)

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    )

  if (hasAccess) return children
  return <Forbidden variant={variant}>{children}</Forbidden>
}
