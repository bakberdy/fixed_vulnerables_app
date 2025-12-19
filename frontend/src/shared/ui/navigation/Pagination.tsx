import { clsx } from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSize?: boolean
  showFirstLast?: boolean
  maxVisible?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  totalItems,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = false,
  showFirstLast = true,
  maxVisible = 7,
  className,
}: PaginationProps) {
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const halfVisible = Math.floor(maxVisible / 2)
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    if (currentPage <= halfVisible) {
      endPage = maxVisible
    } else if (currentPage >= totalPages - halfVisible) {
      startPage = totalPages - maxVisible + 1
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      {/* Page Info */}
      {totalItems !== undefined && (
        <div className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <nav className="flex items-center space-x-2">
        {/* First Page */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={clsx(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            First
          </button>
        )}

        {/* Previous Page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {pageNum}
            </button>
          )
        })}

        {/* Next Page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Last Page */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={clsx(
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            Last
          </button>
        )}
      </nav>

      {/* Page Size Selector */}
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <label htmlFor="page-size" className="text-sm text-gray-700">
            Show
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">per page</span>
        </div>
      )}
    </div>
  )
}
