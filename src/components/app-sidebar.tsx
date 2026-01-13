'use client'

import { Users, Calendar, FileText, Briefcase } from 'lucide-react'
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
import AppListMenu from './apps/app-list-menu'
import { useAppContext } from '@/providers/app-provider'
import { Avatar, AvatarFallback } from './ui/avatar'
import useProfile from '@/hooks/auth/use-profile'

type MenuItem = {
  title: string
  url: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  {
    title: 'Empleados',
    url: '/employees',
    icon: Users,
  },
  {
    title: 'Solicitudes',
    url: '/vacation-requests',
    icon: FileText,
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
  const { data: profile } = useProfile()
  const { currentApp } = useAppContext()
  const { state } = useSidebar()

  const isCollapsed = state === 'collapsed'

  // Preparar los datos del usuario para el componente NavUser
  const userData = {
    name:
      `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
      'Usuario',
    email: profile?.email || '',
    avatar: profile?.avatar_url || '',
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0 border-b border-sidebar-border">
        <div className={isCollapsed ? 'p-3' : 'p-4 pb-3'}>
          {isCollapsed ? (
            // Collapsed: Solo isotipo centrado con tooltip y click
            <div className="flex justify-center">
              <SidebarMenuButton
                asChild
                tooltip={currentApp?.name || 'TDP Corp'}
              >
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
                    <AvatarFallback>
                      {currentApp?.name?.[0] || ''}
                    </AvatarFallback>
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
              {menuItems.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Menu2Items.map((item) => (
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
      </SidebarContent>

      <SidebarFooter className={isCollapsed ? 'p-2' : 'p-4'}>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
