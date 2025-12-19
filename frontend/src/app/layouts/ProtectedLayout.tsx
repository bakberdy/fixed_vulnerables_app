import { Outlet, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { AppShell } from '@/widgets/layout'
import { useAuth } from '@/app/providers/AuthProvider'

export function ProtectedLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'

  const navLinks = useMemo(
    () => {
      if (user?.role === 'freelancer') {
        return [
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Gigs', href: '/gigs/my-gigs' },
          { label: 'Orders', href: '/orders/my-orders' },
          { label: 'Messages', href: '/messages' },
        ]
      }

      return [
        { label: 'Home', href: '/' },
        { label: 'Gigs', href: '/gigs' },
        { label: 'Projects', href: '/projects/my-projects' },
        { label: 'Orders', href: '/orders/my-orders' },
        { label: 'Messages', href: '/messages' },
      ]
    },
    [user?.role]
  )

  const sidebarItems = useMemo(
    () => {
      if (user?.role === 'freelancer') {
        return [
          { label: 'Dashboard', href: dashboardPath },
          { label: 'My Gigs', href: '/gigs/my-gigs' },
          { label: 'Browse Projects', href: '/projects' },
          { label: 'Orders', href: '/orders/my-orders' },
          { label: 'Messages', href: '/messages' },
        ]
      }

      return [
        { label: 'Dashboard', href: dashboardPath },
        { label: 'Browse Gigs', href: '/gigs' },
        { label: 'My Projects', href: '/projects/my-projects' },
        { label: 'Orders', href: '/orders/my-orders' },
        { label: 'Messages', href: '/messages' },
      ]
    },
    [dashboardPath, user?.role]
  )

  const userMenu = useMemo(
    () => [
      {
        label: 'Dashboard',
        onClick: () => navigate(dashboardPath),
      },
      {
        label: 'Logout',
        variant: 'danger' as const,
        onClick: async () => {
          await logout()
          navigate('/login', { replace: true })
        },
      },
    ],
    [dashboardPath, logout, navigate]
  )

  return (
    <AppShell
      navLinks={navLinks}
      sidebarItems={sidebarItems}
      userName={user?.full_name || user?.email || 'User'}
      userAvatar={user?.avatar_url}
      userMenu={userMenu}
    >
      <Outlet />
    </AppShell>
  )
}
