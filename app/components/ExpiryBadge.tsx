'use client'

import { Clock } from 'lucide-react'

interface ExpiryBadgeProps {
  expireAt: string | null
  className?: string
}

export default function ExpiryBadge({ expireAt, className = '' }: ExpiryBadgeProps) {
  if (!expireAt) return null

  const now = Date.now()
  const exp = new Date(expireAt).getTime()
  const diffMs = exp - now

  if (diffMs <= 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 ${className}`}>
        <Clock className="w-3 h-3" />
        Expired
      </span>
    )
  }

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))

  let label: string
  let colorClass: string

  if (diffDays <= 1) {
    label = diffHours <= 1 ? 'Expires in <1h' : `Expires in ${diffHours}h`
    colorClass = 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
  } else if (diffDays <= 3) {
    label = `Expires in ${diffDays}d`
    colorClass = 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400'
  } else {
    label = `Expires in ${diffDays}d`
    colorClass = 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      <Clock className="w-3 h-3" />
      {label}
    </span>
  )
}
