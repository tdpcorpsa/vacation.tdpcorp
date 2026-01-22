'use client'
import { useProfileContext } from '@/providers/profile-provider'

/**
 * Hook para gestionar la verificación de permisos por aplicación.
 */
export default function usePerms() {
  const { profile } = useProfileContext()

  /**
   * Verifica si el usuario tiene acceso a una acción específica sobre un recurso en un subdominio.
   */
  const canAccess = (subdomain: string, resource: string, action: string) => {
    if (profile?.is_superuser) return true

    // Buscar el permiso de aplicación correspondiente al subdominio
      const appPerm = profile?.roles
        ?.flatMap((role) => role?.app_perms || [])
        ?.find((item) => item?.subdomain === subdomain)

      // Buscar el recurso dentro de los permisos (ahora sabemos que perms es un array)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resourcePerm = (appPerm?.perms as any[])?.find(
        (p) => p.value?.trim() === resource?.trim()
      )

      // Buscar la acción dentro de las acciones del recurso
      const hasAction = resourcePerm?.actions?.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any) => a.value?.trim() === action?.trim()
      )

      return hasAction || false
  }

  /**
   * Verifica si la aplicación debe mostrarse (si el usuario tiene algún permiso en ella).
   */
  const showApp = (subdomain: string) => {
    if (profile?.is_superuser) return true

    return profile?.roles
      ?.flatMap((role) => role?.app_perms || [])
      ?.some((item) => item?.subdomain === subdomain)
  }

  return {
    canAccess,
    showApp,
  }
}
