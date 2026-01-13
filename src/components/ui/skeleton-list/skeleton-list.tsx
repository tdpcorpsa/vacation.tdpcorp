import * as React from 'react'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

type SkeletonListVariant = 'table' | 'list' | 'card'

type SkeletonListProps = {
  variant?: SkeletonListVariant
  count?: number
  columns?: number
  className?: string
}

function SkeletonList({
  variant = 'list',
  count = 10,
  columns = 4,
  className,
}: SkeletonListProps) {
  if (variant === 'table') {
    return (
      <div
        data-slot="skeleton-list"
        data-variant="table"
        className={cn(className)}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: count }).map((_, r) => (
              <TableRow key={r}>
                {Array.from({ length: columns }).map((_, c) => (
                  <TableCell key={c}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div
        data-slot="skeleton-list"
        data-variant="card"
        className={cn(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-40" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="mt-2 h-4 w-56" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div
      data-slot="skeleton-list"
      data-variant="list"
      className={cn(className)}
    >
      <ItemGroup>
        {Array.from({ length: count }).map((_, i) => (
          <Item key={i}>
            <ItemMedia variant="icon">
              <Skeleton className="h-8 w-8" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                <Skeleton className="h-4 w-40" />
              </ItemTitle>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

export { SkeletonList }
