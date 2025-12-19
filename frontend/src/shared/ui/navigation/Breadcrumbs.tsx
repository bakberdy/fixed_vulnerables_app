import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export function Breadcrumbs({
  items,
  separator,
  className,
}: BreadcrumbsProps) {
  const defaultSeparator = (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center space-x-2', className)}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center space-x-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={clsx(
                    'text-sm font-medium',
                    isLast ? 'text-gray-900' : 'text-gray-500'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
