'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  History,
  XCircle,
} from 'lucide-react'

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const start = displayValue
    const end = value

    if (start === end) return

    const duration = 1000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4) // easeOutQuart

      const nextValue = Math.round(start + (end - start) * ease)
      setDisplayValue(nextValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [value])

  return <span>{displayValue}</span>
}

interface HrStatsGridProps {
  totalEmployees: number
  totalRequests: number
  pendingRequestsCount: number
  approvedRequestsCount: number
  rejectedRequestsCount: number
  avgDecisionTimeHours: number
}

export function HrStatsGrid({
  totalEmployees,
  totalRequests,
  pendingRequestsCount,
  approvedRequestsCount,
  rejectedRequestsCount,
  avgDecisionTimeHours,
}: HrStatsGridProps) {
  const approvalRate = totalRequests
    ? Math.round((approvedRequestsCount / totalRequests) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-stretch">
      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Empleados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={totalEmployees} />
          </div>
          <p className="text-xs text-muted-foreground">Total registrados</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={totalRequests} />
          </div>
          <p className="text-xs text-muted-foreground">Histórico total</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            <AnimatedCounter value={approvedRequestsCount} />
          </div>
          <p className="text-xs text-muted-foreground">
            <AnimatedCounter value={approvalRate} />% del total
          </p>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            <AnimatedCounter value={pendingRequestsCount} />
          </div>
          <p className="text-xs text-muted-foreground">Requieren atención</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            <AnimatedCounter value={rejectedRequestsCount} />
          </div>
          <p className="text-xs text-muted-foreground">Total rechazadas</p>
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Tiempo Prom.</CardTitle>
          <History className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            <AnimatedCounter value={avgDecisionTimeHours} />h
          </div>
          <p className="text-xs text-muted-foreground">SLA de decisión</p>
        </CardContent>
      </Card>
    </div>
  )
}
