import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HrError() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No se pudo cargar la información</CardTitle>
        <CardDescription>
          Ocurrió un problema al cargar los datos de RRHH.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
