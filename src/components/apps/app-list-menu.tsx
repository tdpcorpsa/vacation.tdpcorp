import { AppWindow, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

import { useAppsList } from '@/hooks/apps/use-apps-list'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback } from '../ui/avatar'
import usePerms from '@/hooks/auth/use-perms'

export default function AppListMenu() {
  const { data } = useAppsList({
    pagination: {
      page: 1,
      pageSize: 100,
    },
  })

  const { showApp } = usePerms()
  const apps = data?.data.filter((app) => showApp(app.subdomain || '')) || []

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8 hover:bg-sidebar-accent transition-colors"
        >
          <LayoutGrid className="size-4" />
          <span className="sr-only">Toggle apps menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="min-w-xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg">
              <img 
                src="/logos/ISOTIPO.svg" 
                alt="TDP Corp" 
                className="size-8"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Aplicaciones</h3>
              <p className="text-xs text-muted-foreground">
                Aplicaciones de TDP Corp S.A.
              </p>
            </div>
          </div>
        </div>

        {/* Apps grid */}
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {apps.map((app) => (
              <Item 
                key={app.id} 
                size="sm" 
                asChild
                className="hover:bg-sidebar-accent/50 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-sidebar-border/50 rounded-lg"
              >
                <Link href={app.url || '#'} target="_blank">
                  <ItemMedia
                    variant="icon"
                    className="size-10 shrink-0 rounded-lg"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg blur-sm" />
                      <Avatar className="relative size-10 border border-sidebar-border/30">
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-semibold">
                          {app.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </ItemMedia>
                  <ItemContent className="gap-0.5">
                    <ItemTitle className="text-sm font-medium leading-none">
                      {app.name}
                    </ItemTitle>
                    {app.description && (
                      <ItemDescription className="line-clamp-2 text-xs">
                        {app.description}
                      </ItemDescription>
                    )}
                  </ItemContent>
                </Link>
              </Item>
            ))}
            {apps.length === 0 && (
              <div className="col-span-2 p-8 text-center">
                <div className="inline-flex p-3 rounded-full bg-muted/50 mb-3">
                  <AppWindow className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No hay aplicaciones
                </p>
                <p className="text-xs text-muted-foreground">
                  No se encontraron aplicaciones disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
