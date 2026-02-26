import { StatusBadgeConfig, StatusBadgeConfigMap } from '@/types/stories.types'

// Default status badge configuration
export const DEFAULT_STATUS_CONFIG: StatusBadgeConfigMap = {
  expiring: {
    status: 'expiring',
    label: 'Expiring',
    color: 'bg-red-400',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
  },
  new: {
    status: 'new',
    label: 'New',
    color: 'bg-orange-400',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
  active: {
    status: 'active',
    label: 'Active',
    color: 'bg-green-400',
    gradient: 'from-primary via-emerald-500 to-teal-500',
  },
}

/**
 * Get status badge configuration with custom overrides
 */
export const getStatusConfig = (
  status: 'new' | 'expiring' | 'active',
  customConfig?: Partial<StatusBadgeConfigMap>
): StatusBadgeConfig => {
  const defaultConfig = DEFAULT_STATUS_CONFIG[status]
  const customStatusConfig = customConfig?.[status]

  return {
    ...defaultConfig,
    ...customStatusConfig,
  }
}

/**
 * Get status label
 */
export const getStatusLabel = (
  status: 'new' | 'expiring' | 'active',
  customConfig?: Partial<StatusBadgeConfigMap>
): string => {
  return getStatusConfig(status, customConfig).label
}

/**
 * Get status color class
 */
export const getStatusColor = (
  status: 'new' | 'expiring' | 'active',
  customConfig?: Partial<StatusBadgeConfigMap>
): string => {
  return getStatusConfig(status, customConfig).color
}

/**
 * Get status gradient class
 */
export const getHighlightGradient = (
  status: 'new' | 'expiring' | 'active',
  customConfig?: Partial<StatusBadgeConfigMap>
): string => {
  return getStatusConfig(status, customConfig).gradient
}
