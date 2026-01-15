import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

const demos = [
  {
    title: 'Dashboard',
    href: '/demo/dashboard',
    description: 'Dashboard principal de vacaciones con KPIs y solicitudes.',
  },
  {
    title: 'Dashboard Jefe Directo',
    href: '/demo/manager-dashboard',
    description: 'Dashboard para gestión de equipo y aprobaciones.',
  },
  {
    title: 'Dashboard RRHH',
    href: '/demo/hr-dashboard',
    description: 'Vista global de la organización para Recursos Humanos.',
  },
  {
    title: 'Alert Confirmation',
    href: '/demo/alert-confirmation',
    description: 'Diálogos de confirmación con diferentes variantes.',
  },
  {
    title: 'Page Header',
    href: '/demo/page-header',
    description: 'Cabecera de página con título, descripción y acciones.',
  },
  {
    title: 'Pagination Group',
    href: '/demo/pagination-group',
    description: 'Componente de paginación sincronizado con la URL.',
  },
  {
    title: 'Skeleton List',
    href: '/demo/skeleton-list',
    description: 'Estados de carga para listas, tablas y tarjetas.',
  },
  {
    title: 'Search Input',
    href: '/demo/search-input',
    description: 'Input de búsqueda sincronizado con la URL.',
  },
]

export default function DemoPage() {
  return (
    <div className="container mx-auto space-y-8 py-6">
      <PageHeader
        title="Demos"
        description="Colección de componentes y ejemplos de uso."
        withSidebar={false}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <Link key={demo.href} href={demo.href} className="block h-full">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{demo.title}</CardTitle>
                <CardDescription>{demo.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
