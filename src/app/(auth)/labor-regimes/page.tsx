import { PageHeader } from '@/components/ui/page-header'
import { LaborRegimesList } from '@/components/labor-regimes/labor-regimes-list'
import { LaborRegimeCreate } from '@/components/labor-regimes/labor-regimes-create'
import CanAccess from '@/components/ui/can-access'

export default function LaborRegimesPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Regímenes Laborales"
        description="Gestione los regímenes laborales de la organización."
        actions={
          <CanAccess
            subdomain="vacation"
            resource="labor_regime"
            action="create"
          >
            <LaborRegimeCreate />
          </CanAccess>
        }
      />

      <div className="flex-1 p-4 pt-0">
        <CanAccess subdomain="vacation" resource="labor_regime" action="read">
          <LaborRegimesList />
        </CanAccess>
      </div>
    </div>
  )
}
