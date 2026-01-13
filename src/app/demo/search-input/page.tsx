'use client'

import { Suspense } from 'react'
import { SearchInput, useSearchQuery } from '@/components/ui/search-input'

function DemoContent() {
  const [q] = useSearchQuery('q')
  return (
    <div className="container mx-auto max-w-2xl space-y-4 py-8">
      <h1 className="text-2xl font-semibold">Demo: SearchInput</h1>
      <p className="text-sm text-muted-foreground">
        El valor se guarda en la URL usando <code>nuqs</code> bajo el parámetro
        <code className="ml-1">q</code>.
      </p>
      <SearchInput placeholder="Buscar…" />
      <div className="text-sm text-muted-foreground">
        Valor actual: <span className="font-medium text-foreground">{q}</span>
      </div>
    </div>
  )
}

export default function DemoSearchInputPage() {
  return (
    <Suspense fallback={<div>Cargando demo...</div>}>
      <DemoContent />
    </Suspense>
  )
}
