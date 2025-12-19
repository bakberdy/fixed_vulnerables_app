import { clsx } from 'clsx'

type TabVariant = 'line' | 'pill' | 'enclosed'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: TabVariant
  fullWidth?: boolean
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  fullWidth = false,
  className,
}: TabsProps) {
  return (
    <div className={clsx('border-b border-gray-200', className)}>
      <nav
        className={clsx(
          'flex',
          fullWidth ? 'w-full' : 'space-x-8',
          variant === 'pill' && 'space-x-2 p-1',
          variant === 'enclosed' && 'space-x-1'
        )}
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const isDisabled = tab.disabled

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onChange(tab.id)}
              disabled={isDisabled}
              className={clsx(
                'flex items-center space-x-2 font-medium transition-colors',
                fullWidth && 'flex-1 justify-center',
                isDisabled && 'opacity-50 cursor-not-allowed',

                // Line variant
                variant === 'line' && [
                  'px-1 py-4 border-b-2',
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ],

                // Pill variant
                variant === 'pill' && [
                  'px-4 py-2 rounded-lg',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                ],

                // Enclosed variant
                variant === 'enclosed' && [
                  'px-4 py-2 border-t border-l border-r rounded-t-lg',
                  isActive
                    ? 'bg-white text-gray-900 border-gray-200 border-b-white -mb-px'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700 border-transparent',
                ]
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
