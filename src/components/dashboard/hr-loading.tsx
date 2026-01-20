import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HrLoading() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cargando información de RRHH</CardTitle>
          <CardDescription>
            Obteniendo datos globales de vacaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 w-full animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}
