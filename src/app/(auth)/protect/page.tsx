'use client'

import { Button } from '@/components/ui/button'
import useLogout from '@/hooks/auth/use-logout'

// This is only an example page
export default function ProtectedPage() {
  const { mutate } = useLogout()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Página Protegida (Ejemplo)
        </h1>
        <p className="text-gray-600">
          Esta es una página protegida de ejemplo. Solo usuarios autorizados
          pueden acceder aquí. Todas las páginas bajo la carpeta /(auth)/ son
          páginas protegidas.
        </p>
        <div className="pt-4">
          <Button onClick={() => mutate()}>Cerrar sesión</Button>
        </div>
      </div>
    </div>
  )
}
