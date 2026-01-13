'use client'

import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

const LoginSchema = z.object({
  email: z.email('Por favor, ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof LoginSchema>

export default function DevLoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutate } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const { error } = await supabase.auth.signInWithPassword(data)
      if (error) {
        throw error
      }
      return { success: true }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Inicio de sesión exitoso')
      const next = searchParams.get('next') || '/'
      router.push(next)
    },
  })

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  return (
    <div>
      <div className="w-full max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Este login es solo para desarrollo; en producción serás redirigido a
            la app de auth.
          </AlertDescription>
        </Alert>
        <h1 className="text-2xl font-semibold text-center mb-6">Dev Login</h1>
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
