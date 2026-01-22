'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { LaborRegimeActions } from './labor-regimes-actions'
import { Tables } from '@/types/supabase.types'
import { cn } from '@/lib/utils'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

interface LaborRegimeCardProps {
  item: LaborRegime
}

export function LaborRegimeCard({ item }: LaborRegimeCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">{item.name}</span>
          <span
            className={cn(
              'text-xs font-medium',
              item.is_active ? 'text-green-600' : 'text-red-600'
            )}
          >
            {item.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <LaborRegimeActions item={item} />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Días de vacaciones:{' '}
          <span className="font-medium text-foreground">{item.days}</span>
        </div>
      </CardContent>
    </Card>
  )
}
