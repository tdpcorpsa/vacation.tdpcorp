import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import ProfileProvider from '@/providers/profile-provider'

const loginUrl = process.env.NEXT_PUBLIC_LOGIN || '/dev-login'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const headerList = await headers()
  const currentUrl = headerList.get('x-current-url') || '/'
  const { data } = await supabase.auth.getSession()
  // redirect to login
  // when is production redirect to NEXT_PUBLIC_LOGIN
  // when is development redirect to /dev-login
  if (!data.session) {
    return redirect(`${loginUrl}?next=${encodeURIComponent(currentUrl)}`)
  }

  return (
    <ProfileProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarProvider>
    </ProfileProvider>
  )
}
