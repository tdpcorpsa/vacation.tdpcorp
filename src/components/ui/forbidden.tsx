'use client'

import { CircleOff } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty'
import { ReactNode, cloneElement, isValidElement } from 'react'

const ForbiddenPage = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <CircleOff className="text-muted-foreground" />
      </EmptyMedia>
      <EmptyTitle>403 - Prohibido</EmptyTitle>
      <EmptyDescription>
        No tienes permisos suficientes para acceder.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)

export const ForbiddenDisabled = ({ children }: { children?: ReactNode }) => {
  if (!children) return null
  if (!isValidElement(children)) return null

  return cloneElement<any>(children, {
    disabled: true,
    onClick: undefined,
    onChange: undefined,
    'aria-disabled': true,
    tabIndex: -1,
  })
}

export type ForbiddenProps = {
  variant?: 'page' | 'disabled' | 'hidden'
  children?: ReactNode
}

export default function Forbidden({
  variant = 'page',
  children,
}: ForbiddenProps) {
  if (variant === 'hidden') return null

  return (
    <>
      {variant === 'page' && <ForbiddenPage />}
      {variant === 'disabled' && (
        <ForbiddenDisabled>{children}</ForbiddenDisabled>
      )}
    </>
  )
}
