import type { ReactNode } from 'react'
import { Header } from '@/shared/ui/navigation/Header'
import { Sidebar } from '@/shared/ui/navigation/Sidebar'

interface NavLink {
  label: string
  href: string
}

interface SidebarItem {
  label: string
  href: string
  icon?: ReactNode
  badge?: string | number
}

interface UserMenuItem {
  label: string
  onClick?: () => void
  variant?: 'default' | 'danger'
}

interface AppShellProps {
  navLinks: NavLink[]
  sidebarItems?: SidebarItem[]
  userName?: string
  userAvatar?: string
  userMenu?: UserMenuItem[]
  children: ReactNode
}

export function AppShell({
  navLinks,
  sidebarItems = [],
  userName,
  userAvatar,
  userMenu = [],
  children,
}: AppShellProps) {
  const hasSidebar = sidebarItems.length > 0
  const headerNavLinks = hasSidebar ? [] : navLinks

  return (
    <div className="relative min-h-screen bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.1),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(16,185,129,0.12),transparent_32%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          navLinks={headerNavLinks}
          userName={userName}
          userAvatar={userAvatar}
          userMenu={userMenu}
          className="backdrop-blur-xl bg-white/85 shadow-sm"
        />
        <div className="flex w-full gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          {hasSidebar && (
            <div className="hidden lg:block sticky top-24 h-[calc(100vh-112px)]">
              <Sidebar items={sidebarItems} className="h-full" />
            </div>
          )}
          <main className="flex-1 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 backdrop-blur sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
