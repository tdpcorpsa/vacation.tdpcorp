'use client'

import * as React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AlertConfirmationProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmWord: string
  confirmPrompt?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => unknown | Promise<unknown>
  onCancel?: () => void
}

export function AlertConfirmation({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmWord,
  confirmPrompt,
  variant = 'default',
  onConfirm,
  onCancel,
}: AlertConfirmationProps) {
  const [confirmInput, setConfirmInput] = React.useState('')
  const requiredWord = (confirmWord || confirmLabel)
    .trim()
    .split(/\s+/)[0]
    .toUpperCase()
  const isConfirmEnabled = confirmInput.trim() === requiredWord

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
    setConfirmInput('')
  }

  const handleConfirm = async () => {
    if (!isConfirmEnabled) return
    await onConfirm()
    onOpenChange(false)
    setConfirmInput('')
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="alert-confirmation-input">
            {confirmPrompt ?? `Para confirmar, escribe ${requiredWord}`}
          </Label>
          <Input
            id="alert-confirmation-input"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={`Escribe "${requiredWord}"`}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className={buttonVariants({ variant: 'outline' })}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={buttonVariants({ variant })}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertConfirmation
