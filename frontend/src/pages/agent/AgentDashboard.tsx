import { useQuery } from '@tanstack/react-query'
import { getAgentDashboard } from '../../api/dashboard'
import { useAuth } from '../../context/AuthContext'
import type { FieldStatus } from '../../types'

const statusColors: Record<FieldStatus, string> = {
  ACTIVE: 'text-green-600',
  AT_RISK: 'text-red-600',
  COMPLETED: 'text-gray-500'
}

export default function AgentDashboard() {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['agent-dashboard'],
    queryFn: getAgentDashboard
  })

  if (isLoading) return <p className="text-gray-500 text-sm">Loading dashboard...</p>
  if (error || !data) return <p className="text-red-500 text-sm">Failed to load dashboard.</p>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {user?.fullName}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's an overview of your assigned fields</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400">Assigned Fields</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{data.totalAssignedFields}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400">At Risk</p>
          <p className={`text-3xl font-semibold mt-1 ${data.statusBreakdown['AT_RISK'] > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {data.statusBreakdown['AT_RISK'] ?? 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">
            {data.statusBreakdown['COMPLETED'] ?? 0}
          </p>
        </div>
      </div>

      {/* Action hints */}
      {data.actionHints.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-gray-700 mb-3">Action Items</h2>
          <div className="space-y-2">
            {data.actionHints.map((hint, i) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm text-green-800">
                {hint}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* At risk fields */}
      {data.atRiskFields.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-red-600 mb-3">
            Fields Needing Attention
          </h2>
          <div className="bg-white border border-red-100 rounded-xl divide-y divide-gray-100">
            {data.atRiskFields.map((field) => (
              <div key={field.fieldId} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{field.fieldName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {field.cropType} · {field.stage} · {field.daysSincePlanting} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent updates */}
      {data.recentUpdates.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-gray-700 mb-3">Your Recent Updates</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {data.recentUpdates.map((update) => (
              <div key={update.id} className="px-4 py-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{update.fieldName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {update.newStage && `Stage → ${update.newStage}`}
                    {update.note && ` · "${update.note}"`}
                  </p>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {new Date(update.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}