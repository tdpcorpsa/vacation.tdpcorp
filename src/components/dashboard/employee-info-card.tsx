import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  MoreHorizontal,
  Pencil,
  User,
  Mail,
  Phone,
  CalendarDays,
  Briefcase,
  UserCheck,
} from 'lucide-react'
import { EmployeeSummary } from '@/hooks/dashboard/use-dashboard-data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CanAccess from '@/components/ui/can-access'

interface EmployeeInfoCardProps {
  employeeSummary: EmployeeSummary | null
  onEditEmployee: () => void
}

export function EmployeeInfoCard({
  employeeSummary,
  onEditEmployee,
}: EmployeeInfoCardProps) {
  return (
    <Card className="lg:col-span-3 h-full flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-sm font-medium">
            Información del Empleado
          </CardTitle>
          <CardDescription>
            Resumen de datos personales y laborales.
          </CardDescription>
        </div>
        <CanAccess
          subdomain="vacation"
          resource="employees"
          action="edit"
          variant="hidden"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditEmployee}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CanAccess>
      </CardHeader>
      <CardContent className="space-y-3 text-xs flex-1">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold text-sm">
              {employeeSummary?.profile
                ? `${employeeSummary.profile.first_name || ''} ${employeeSummary.profile.last_name || ''}`.trim()
                : '-'}
            </p>
            <p className="text-muted-foreground text-xs">
              {employeeSummary?.roleDescription || 'Empleado'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Email:{' '}
              <span className="text-foreground">
                {employeeSummary?.profile?.email || '-'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Teléfono:{' '}
              <span className="text-foreground">
                {employeeSummary?.profile?.phone || '-'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Fecha de ingreso:{' '}
              <span className="text-foreground">
                {employeeSummary?.employee.hire_date
                  ? new Date(
                      employeeSummary.employee.hire_date
                    ).toLocaleDateString()
                  : '-'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Régimen laboral:{' '}
              <span className="text-foreground font-medium">
                {employeeSummary?.laborRegime?.name || '-'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Jefe directo:{' '}
              <span className="text-foreground">
                {employeeSummary?.managerProfile
                  ? `${employeeSummary.managerProfile.first_name || ''} ${employeeSummary.managerProfile.last_name || ''}`.trim()
                  : '-'}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
