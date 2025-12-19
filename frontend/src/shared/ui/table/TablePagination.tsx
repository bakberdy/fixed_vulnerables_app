import { clsx } from 'clsx'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function TablePagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: TablePaginationProps) {
  if (totalPages <= 1) return null

  const startPage = Math.max(1, currentPage - siblingCount)
  const endPage = Math.min(totalPages, currentPage + siblingCount)
  const pages = range(startPage, endPage)

  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => canPrev && onPageChange(currentPage - 1)}
          className={clsx(
            'relative inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium',
            canPrev ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          )}
          disabled={!canPrev}
        >
          Previous
        </button>
        <button
          onClick={() => canNext && onPageChange(currentPage + 1)}
          className={clsx(
            'relative ml-3 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium',
            canNext ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          )}
          disabled={!canNext}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => canPrev && onPageChange(currentPage - 1)}
              className={clsx(
                'relative inline-flex items-center rounded-l-md border px-2 py-2 text-sm font-medium',
                canPrev ? 'bg-white text-gray-500 hover:bg-gray-50' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              )}
              disabled={!canPrev}
            >
              ‹
            </button>
            {startPage > 1 && (
              <button
                onClick={() => onPageChange(1)}
                className="relative inline-flex items-center border px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
              >
                1
              </button>
            )}
            {startPage > 2 && <span className="relative inline-flex items-center border px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">…</span>}
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={clsx(
                  'relative inline-flex items-center border px-4 py-2 text-sm font-medium',
                  page === currentPage ? 'z-10 bg-primary-50 border-primary-500 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ))}
            {endPage < totalPages - 1 && <span className="relative inline-flex items-center border px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">…</span>}
            {endPage < totalPages && (
              <button
                onClick={() => onPageChange(totalPages)}
                className="relative inline-flex items-center border px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => canNext && onPageChange(currentPage + 1)}
              className={clsx(
                'relative inline-flex items-center rounded-r-md border px-2 py-2 text-sm font-medium',
                canNext ? 'bg-white text-gray-500 hover:bg-gray-50' : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              )}
              disabled={!canNext}
            >
              ›
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
