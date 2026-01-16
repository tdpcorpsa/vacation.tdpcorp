'use client'

import { VacationPeriodsCreate } from '@/components/vacation-periods/vacation-periods-create'
import { VacationPeriodsList } from '@/components/vacation-periods/vacation-periods-list'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function VacationPeriodsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Periodos Vacacionales"
        description="Gestione los periodos vacacionales de los empleados."
        actions={
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Periodo
          </Button>
        }
      />
      <div className="container mx-auto p-4 pt-0">
        <VacationPeriodsList />
        <VacationPeriodsCreate
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>
    </div>
  )
}
