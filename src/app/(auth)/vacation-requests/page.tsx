'use client'

import { VacationRequestsCreate } from '@/components/vacation-requests/vacation-requests-create'
import { VacationRequestsList } from '@/components/vacation-requests/vacation-requests-list'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function VacationRequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Solicitudes de Vacaciones"
        description="Gestione sus solicitudes de vacaciones."
        actions={
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Solicitud
          </Button>
        }
      />
      <div className="container mx-auto p-4 pt-0">
        <VacationRequestsList />
        <VacationRequestsCreate
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </div>
    </div>
  )
}
