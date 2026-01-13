'use client'

import { useQueryState, parseAsString } from 'nuqs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type SearchInputProps = {
  param?: string
  placeholder?: string
  className?: string
  autoFocus?: boolean
  delayMs?: number
} & React.InputHTMLAttributes<HTMLInputElement>

export function SearchInput({
  param = 'q',
  placeholder = 'Buscar…',
  className,
  autoFocus = false,
  delayMs = 400,
  ...props
}: SearchInputProps) {
  const [value, setValue] = useQueryState(
    param,
    parseAsString
      .withDefault('')
      .withOptions({ shallow: true, throttleMs: 0, clearOnDefault: true })
  )

  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    const id = setTimeout(() => {
      if (text !== value) setValue(text)
    }, delayMs)
    return () => clearTimeout(id)
  }, [text, value, setValue, delayMs])

  return (
    <div className={cn('relative w-full', className)} {...props}>
      <Search
        aria-hidden
        className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
      />
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-8 pr-8"
        aria-label="Buscar"
      />
      {text && (
        <button
          type="button"
          onClick={() => setText('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Limpiar búsqueda"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
