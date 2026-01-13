/**
 * Aplica búsqueda de Supabase a la consulta usando AppliedPagination
 */

type FieldWithReferencedTable = {
  referencedTable: string
  fields: string[]
}

export function applySupabaseSearch(
  query: unknown,
  search?: string,
  fields?: string[],
  fieldWithReferencedTable?: FieldWithReferencedTable[]
) {
  let q: any = query as any
  if (!search || !fields) return query

  // Aplicar búsqueda en múltiples campos
  if (fields?.length) {
    q = q.or(fields?.map((field) => `${field}.ilike.*${search}*`).join(','))
  }

  // Aplicar búsqueda en múltiples campos con tabla referenciada
  if (fieldWithReferencedTable?.length) {
    for (const item of fieldWithReferencedTable) {
      const orExpr = item.fields
        ?.map((field) => `${field}.ilike.*${search}*`)
        .join(',')

      if (orExpr && orExpr.length) {
        q = q.or(orExpr, { referencedTable: item.referencedTable })
      }
    }
  }

  return q
}
