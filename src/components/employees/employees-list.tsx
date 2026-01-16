'use client'

import { useState } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { useEmployeesList } from '@/hooks/employees/use-employees-list'
import { EmployeesActions } from './employees-actions'
import { PageHeader } from '@/components/ui/page-header'
import { SelectView, ViewType } from '@/components/ui/select-view'
import { SearchInput } from '@/components/ui/search-input'
import { PaginationGroup } from '@/components/ui/pagination-group'
import { usePagination } from '@/components/ui/pagination-group/use-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Item, ItemMedia, ItemSeparator } from '@/components/ui/item'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkeletonList } from '@/components/ui/skeleton-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function EmployeesList() {
  const { page, pageSize } = usePagination()
  const pagination = { page, pageSize }
  const [view, setView] = useState<ViewType>('table')
  const [search] = useQueryState('q', parseAsString.withDefault(''))

  const { data, isLoading } = useEmployeesList({
    pagination,
    search,
  })

  return (
    <div className="space-y-4">
      <PageHeader
        title="Empleados"
        description="Gestión de empleados de la empresa."
      />

      <div className="mx-auto w-[95%] space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchInput placeholder="Buscar por nombre o email..." />
          </div>
          <SelectView view={view} onViewChange={setView} />
        </div>

        {isLoading ? (
          <SkeletonList count={5} />
        ) : !data?.data || data.data.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">No hay empleados</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              No se encontraron empleados registrados.
            </p>
          </div>
        ) : (
          <>
            {view === 'table' && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Fecha Ingreso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={employee.user?.avatar_url || ''}
                            />
                            <AvatarFallback>
                              {employee.user?.first_name?.[0]}
                              {employee.user?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {employee.user?.first_name}{' '}
                              {employee.user?.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {employee.user?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {employee.hire_date
                            ? format(
                                new Date(employee.hire_date),
                                'dd/MM/yyyy',
                                {
                                  locale: es,
                                }
                              )
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <EmployeesActions employee={employee} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {view === 'list' && (
              <div className="space-y-2">
                {data.data.map((employee) => (
                  <Item key={employee.id} className="justify-between">
                    <div className="flex items-center gap-4">
                      <ItemMedia>
                        <Avatar>
                          <AvatarImage src={employee.user?.avatar_url || ''} />
                          <AvatarFallback>
                            {employee.user?.first_name?.[0]}
                            {employee.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <div>
                        <div className="font-medium">
                          {employee.user?.first_name} {employee.user?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {employee.hire_date
                          ? format(new Date(employee.hire_date), 'dd/MM/yyyy', {
                              locale: es,
                            })
                          : '-'}
                      </div>
                      <EmployeesActions employee={employee} />
                    </div>
                  </Item>
                ))}
              </div>
            )}

            {view === 'card' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((employee) => (
                  <Card key={employee.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {employee.user?.first_name} {employee.user?.last_name}
                      </CardTitle>
                      <EmployeesActions employee={employee} />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 py-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={employee.user?.avatar_url || ''} />
                          <AvatarFallback>
                            {employee.user?.first_name?.[0]}
                            {employee.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {employee.user?.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ingreso:{' '}
                            {employee.hire_date
                              ? format(
                                  new Date(employee.hire_date),
                                  'dd/MM/yyyy',
                                  {
                                    locale: es,
                                  }
                                )
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <PaginationGroup
                total={data.total}
                pageSize={pagination.pageSize}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
