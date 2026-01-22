'use client'

import { LaborRegimeActions } from './labor-regimes-actions'
import { Tables } from '@/types/supabase.types'
import { cn } from '@/lib/utils'

type LaborRegime = Tables<{ schema: 'vacation' }, 'labor_regime'>

interface LaborRegimeItemProps {
  item: LaborRegime
}

export function LaborRegimeItem({ item }: LaborRegimeItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1">
        <span className="font-semibold">{item.name}</span>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{item.days} días</span>
          <span>•</span>
          <span
            className={cn(
              'font-medium',
              item.is_active ? 'text-green-600' : 'text-red-600'
            )}
          >
            {item.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
      <LaborRegimeActions item={item} />
    </div>
  )
}
