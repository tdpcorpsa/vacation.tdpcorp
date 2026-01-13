'use client'

import * as React from 'react'
import AlertConfirmation from '@/components/ui/alert-confirmation'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export default function AlertConfirmationDemoPage() {
  const [openSimple, setOpenSimple] = React.useState(false)
  const [openDestructive, setOpenDestructive] = React.useState(false)
  const [openWord, setOpenWord] = React.useState(false)
  const [openFromDropdown, setOpenFromDropdown] = React.useState(false)
  const [openFromListItem, setOpenFromListItem] = React.useState(false)
  const [openDeactivate, setOpenDeactivate] = React.useState(false)

  return (
    <div className="container mx-auto space-y-8 py-6">
      <PageHeader
        title="Demo: AlertConfirmation"
        description="Diálogo reutilizable para confirmar acciones, con soporte de palabra de confirmación."
        withSidebar={false}
      />

      <section className="grid gap-4">
        <div className="grid gap-2">
          <h2 className="text-base font-semibold">Confirmación simple</h2>
          <div className="flex gap-2">
            <Button onClick={() => setOpenSimple(true)}>Abrir</Button>
          </div>
          <AlertConfirmation
            open={openSimple}
            onOpenChange={setOpenSimple}
            title="¿Deseas continuar?"
            description="Esta acción requerirá confirmación explícita."
            confirmWord="CONFIRMAR"
            confirmPrompt="Para confirmar, escribe CONFIRMAR"
            onConfirm={() => toast.success('Acción confirmada')}
            onCancel={() => toast.info('Acción cancelada')}
          />
        </div>

        <div className="grid gap-2">
          <h2 className="text-base font-semibold">Confirmación destructiva</h2>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => setOpenDestructive(true)}
            >
              Abrir
            </Button>
          </div>
          <AlertConfirmation
            open={openDestructive}
            onOpenChange={setOpenDestructive}
            title="Eliminar elemento"
            description="Esta acción no se puede deshacer."
            confirmLabel="Eliminar"
            variant="destructive"
            confirmWord="ELIMINAR"
            confirmPrompt="Para confirmar, escribe ELIMINAR"
            onConfirm={() => toast.success('Elemento eliminado')}
            onCancel={() => toast.info('Eliminación cancelada')}
          />
        </div>

        <div className="grid gap-2">
          <h2 className="text-base font-semibold">
            Con palabra de confirmación
          </h2>
          <p className="text-sm text-muted-foreground">
            El botón de confirmar se habilitará cuando el texto coincida.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setOpenWord(true)}>Abrir</Button>
          </div>
          <AlertConfirmation
            open={openWord}
            onOpenChange={setOpenWord}
            title="Eliminar usuario"
            description="Para confirmar, escribe la palabra exacta."
            confirmLabel="Eliminar"
            variant="destructive"
            confirmWord="ELIMINAR"
            confirmPrompt="Escribe: ELIMINAR"
            onConfirm={() => toast.success('Usuario eliminado')}
            onCancel={() => toast.info('Operación cancelada')}
          />
        </div>

        <div className="grid gap-2">
          <h2 className="text-base font-semibold">Desactivar (destructive)</h2>
          <p className="text-sm text-muted-foreground">
            Ejemplo de desactivación con aviso en rojo.
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => setOpenDeactivate(true)}
            >
              Desactivar usuario
            </Button>
          </div>
          <AlertConfirmation
            open={openDeactivate}
            onOpenChange={setOpenDeactivate}
            title="Desactivar Usuario"
            description={
              <>
                Esta acción desactivará el acceso del usuario al sistema.
                <span className="block mt-2 text-destructive">
                  Esta acción no se puede deshacer.
                </span>
              </>
            }
            confirmWord="DESACTIVAR"
            confirmPrompt="Para confirmar, escribe DESACTIVAR"
            confirmLabel="Desactivar"
            variant="destructive"
            onConfirm={() => toast.success('Usuario desactivado')}
            onCancel={() => toast.info('Cancelado')}
          />
        </div>

        <div className="grid gap-2">
          <h2 className="text-base font-semibold">Desde DropdownMenu</h2>
          <p className="text-sm text-muted-foreground">
            Abrir confirmación desde un menú contextual.
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Acciones</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setOpenFromDropdown(true)}>
                Eliminar elemento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertConfirmation
            open={openFromDropdown}
            onOpenChange={setOpenFromDropdown}
            title="Eliminar desde menú"
            description="Esta acción no se puede deshacer."
            confirmWord="ELIMINAR"
            confirmPrompt="Para confirmar, escribe ELIMINAR"
            confirmLabel="Eliminar"
            variant="destructive"
            onConfirm={() => toast.success('Eliminado desde menú')}
            onCancel={() => toast.info('Cancelado')}
          />
        </div>

        <div className="grid gap-2">
          <h2 className="text-base font-semibold">Desde item de lista</h2>
          <p className="text-sm text-muted-foreground">
            Abrir confirmación desde un elemento clickable, no botón.
          </p>
          <div
            role="button"
            tabIndex={0}
            className="px-3 py-2 rounded-md border cursor-pointer hover:bg-accent"
            onClick={() => setOpenFromListItem(true)}
            onKeyDown={(e) => e.key === 'Enter' && setOpenFromListItem(true)}
          >
            Eliminar registro #123
          </div>
          <AlertConfirmation
            open={openFromListItem}
            onOpenChange={setOpenFromListItem}
            title="Eliminar registro #123"
            description="Confirma la eliminación del registro seleccionado."
            confirmWord="ELIMINAR"
            confirmPrompt="Para confirmar, escribe ELIMINAR"
            confirmLabel="Eliminar"
            variant="destructive"
            onConfirm={() => toast.success('Registro #123 eliminado')}
            onCancel={() => toast.info('Cancelado')}
          />
        </div>
      </section>
    </div>
  )
}
