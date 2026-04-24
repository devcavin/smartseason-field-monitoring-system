import type { FieldStatus } from '../types'

const styles: Record<FieldStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  AT_RISK: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600'
}

export default function FieldStatusBadge({ status }: { status: FieldStatus }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}