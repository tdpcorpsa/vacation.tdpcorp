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

    const appPerm = profile?.roles
      ?.flatMap((role) => role?.app_perms || [])
      ?.find((item) => item?.subdomain === subdomain)
    return (appPerm as any)?.[resource]?.[action] === true
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
