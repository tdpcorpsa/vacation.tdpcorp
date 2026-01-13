import { PageHeader } from '@/components/ui/page-header'

export default function DemoPageHeader() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestione los usuarios de su cuenta."
        withSidebar={false}
      />

      <PageHeader
        title="Aplicaciones"
        description="Administre las aplicaciones disponibles."
        withSidebar={false}
        actions={
          <button className="rounded-md border px-3 py-1 text-sm">
            Acción
          </button>
        }
      />
    </div>
  )
}
