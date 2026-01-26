'use client'

import {
  Users,
  Calendar,
  FileText,
  Briefcase,
  LayoutDashboard,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavUser } from '@/components/profile/user-nav'
import { useAppContext } from '@/providers/app-provider'
import AppListMenu from './apps/app-list-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import usePerms from '@/hooks/auth/use-perms'
import { useProfileContext } from '@/providers/profile-provider'

type MenuItem = {
  title: string
  url: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Solicitudes',
    url: '/vacation-requests',
    icon: FileText,
  },
  {
    title: 'Empleados',
    url: '/employees',
    icon: Users,
  },
  {
    title: 'Periodos',
    url: '/vacation-periods',
    icon: Calendar,
  },
]

const Menu2Items: MenuItem[] = [
  {
    title: 'Regímenes Laborales',
    url: '/labor-regimes',
    icon: Briefcase,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { currentApp } = useAppContext()
  const { state } = useSidebar()
  const { canAccess } = usePerms()
  const { profile } = useProfileContext()

  const isCollapsed = state === 'collapsed'

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.url === '/employees') {
      return canAccess('vacation', 'employees', 'read')
    }
    if (item.url === '/vacation-periods') {
      return canAccess('vacation', 'vacation_periods', 'read')
    }
    return true
  })

  const filteredMenu2Items = Menu2Items.filter((item) => {
    if (item.url === '/labor-regimes') {
      return profile?.is_superuser
    }
    return true
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0 border-b border-sidebar-border">
        <div className={isCollapsed ? 'p-3' : 'p-4 pb-3'}>
          {isCollapsed ? (
            // Collapsed: Solo isotipo centrado con tooltip y click
            <div className="flex justify-center">
              <SidebarMenuButton asChild tooltip={currentApp?.name || 'TDP Corp'}>
                <Link href="/">
                  <img
                    src="/logos/ISOTIPO.svg"
                    alt={currentApp?.name || 'Logo'}
                    className="h-8 w-8 object-contain"
                  />
                </Link>
              </SidebarMenuButton>
            </div>
          ) : (
            // Expanded: Logo completo y app info
            <>
              <div className="flex items-center justify-between gap-3 mb-3">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <img
                    src="/logos/LOGOTIPO.svg"
                    alt={currentApp?.name || 'Logo'}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                
                {/* App menu button */}
                <AppListMenu />
              </div>
              
              {/* App name with subtle background */}
              <div className="bg-sidebar-accent/30 rounded-lg px-3 py-1 border border-sidebar-border/50">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{currentApp?.name?.[0] || ''}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-sidebar-foreground">
                    {currentApp?.name || 'TDP Corp'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {filteredMenu2Items.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Configuración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenu2Items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className={isCollapsed ? 'p-2' : 'p-4'}>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
