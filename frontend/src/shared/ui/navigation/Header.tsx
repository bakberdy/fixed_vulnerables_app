import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '../Button'

interface NavLink {
  label: string
  href: string
}

interface UserMenuItemType {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'danger'
}

interface HeaderProps {
  logo?: React.ReactNode
  navLinks?: NavLink[]
  userMenu?: UserMenuItemType[]
  userName?: string
  userAvatar?: string
  onLogin?: () => void
  onRegister?: () => void
  className?: string
}

export function Header({
  logo,
  navLinks = [],
  userMenu = [],
  userName,
  userAvatar,
  onLogin,
  onRegister,
  className,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()

  const isAuthenticated = !!userName

  return (
    <header className={clsx('sticky top-0 z-40 border-b border-white/40 bg-white/85 backdrop-blur-xl', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              {logo || (
                <span className="text-2xl font-bold text-primary-600">
                  FreelancePro
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 rounded-full bg-white/60 px-2 py-1 shadow-sm ring-1 ring-gray-100 backdrop-blur">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'px-3 py-2 text-sm font-semibold transition-all rounded-full',
                    isActive
                      ? 'bg-primary-600 text-white shadow'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Auth / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="group flex items-center gap-2 rounded-full bg-white/70 px-2 py-1 pl-1 pr-3 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-100 backdrop-blur transition"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600 ring-2 ring-white">
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-900">{userName}</span>
                  <svg
                    className={clsx(
                      'w-4 h-4 text-gray-500 transition-transform',
                      isUserMenuOpen && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5 z-50">
                      {userMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            item.onClick?.()
                          }}
                          className={clsx(
                            'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                            item.variant === 'danger'
                              ? 'text-error-600 hover:bg-error-50'
                              : 'text-gray-700'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={onLogin} className="text-sm font-semibold">
                  Login
                </Button>
                <Button variant="primary" onClick={onRegister} className="text-sm font-semibold shadow-sm">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-full p-2 text-gray-700 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur">
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 mb-4">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-gray-900 font-medium">{userName}</span>
              </div>
              <div className="space-y-1">
                {userMenu.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      item.onClick?.()
                    }}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100',
                      item.variant === 'danger'
                        ? 'text-error-600'
                        : 'text-gray-700'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 pb-4 border-t border-gray-200 pt-4 space-y-2">
              <Button variant="ghost" fullWidth onClick={onLogin}>
                Login
              </Button>
              <Button variant="primary" fullWidth onClick={onRegister}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
