/**
 * Aplica paginación de Supabase a la consulta usando AppliedPagination
 */
export function applySupabasePagination(
  query: unknown,
  pagination?: {
    page: number
    pageSize: number
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = query as any
  if (!pagination) return query

  const { page, pageSize } = pagination

  // Validar parámetros
  if (page < 1 || pageSize < 1) {
    console.warn('Parámetros de paginación inválidos:', { page, pageSize })
    return query
  }

  // Calcular offset
  const offset = (page - 1) * pageSize

  // Aplicar límites para paginación
  q = q.range(offset, offset + pageSize - 1)

  return q
}
