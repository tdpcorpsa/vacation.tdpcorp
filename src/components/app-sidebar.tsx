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

type MenuItem = {
  title: string
  url: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
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
  const { currentApp } = useAppContext()
  const { state } = useSidebar()

  const isCollapsed = state === 'collapsed'

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/ISOTIPO.svg"
                    alt={currentApp?.name || 'Logo'}
                    className="size-8"
                  />
                </Link>
              </SidebarMenuButton>
            </div>
          ) : (
            // Expanded: Logo completo
            <Link href="/" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/LOGOTIPO.svg"
                alt={currentApp?.name || 'Logo'}
                className="h-8 w-auto"
              />
            </Link>
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
