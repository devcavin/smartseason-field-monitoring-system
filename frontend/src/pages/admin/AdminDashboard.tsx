import { useQuery } from '@tanstack/react-query'
import { getAdminDashboard } from '../../api/dashboard'
import type { FieldStage } from '../../types'

const stageColors: Record<FieldStage, string> = {
  PLANTED: 'bg-yellow-100 text-yellow-700',
  GROWING: 'bg-blue-100 text-blue-700',
  READY: 'bg-green-100 text-green-700',
  HARVESTED: 'bg-gray-100 text-gray-600'
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard
  })

  if (isLoading) return <p className="text-gray-500 text-sm">Loading dashboard...</p>
  if (error || !data) return <p className="text-red-500 text-sm">Failed to load dashboard.</p>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Fields" value={data.totalFields} />
        <StatCard label="Total Agents" value={data.totalAgents} />
        <StatCard
          label="At Risk"
          value={data.statusBreakdown['AT_RISK'] ?? 0}
          highlight={data.statusBreakdown['AT_RISK'] > 0}
        />
        <StatCard label="Completed" value={data.statusBreakdown['COMPLETED'] ?? 0} />
      </div>

      {/* Stage breakdown */}
      <section>
        <h2 className="text-base font-medium text-gray-700 mb-3">Season Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(data.stageBreakdown) as [FieldStage, number][]).map(([stage, count]) => (
            <div key={stage} className="bg-white border border-gray-200 rounded-lg p-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${stageColors[stage]}`}>
                {stage}
              </span>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{count}</p>
              <p className="text-xs text-gray-400">fields</p>
            </div>
          ))}
        </div>
      </section>

      {/* At risk fields */}
      {data.atRiskFields.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-red-600 mb-3">
            Fields Needing Attention ({data.atRiskFields.length})
          </h2>
          <div className="bg-white border border-red-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-red-50 text-red-700">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Field</th>
                  <th className="text-left px-4 py-3 font-medium">Crop</th>
                  <th className="text-left px-4 py-3 font-medium">Stage</th>
                  <th className="text-left px-4 py-3 font-medium">Days</th>
                  <th className="text-left px-4 py-3 font-medium">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.atRiskFields.map((field) => (
                  <tr key={field.fieldId}>
                    <td className="px-4 py-3 font-medium text-gray-900">{field.fieldName}</td>
                    <td className="px-4 py-3 text-gray-600">{field.cropType}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${stageColors[field.stage]}`}>
                        {field.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{field.daysSincePlanting}d</td>
                    <td className="px-4 py-3 text-gray-600">{field.assignedAgentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Agent summaries */}
      <section>
        <h2 className="text-base font-medium text-gray-700 mb-3">Agent Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.agentSummaries.map((agent) => (
            <div
              key={agent.agentId}
              className={`bg-white border rounded-xl p-4 flex items-center justify-between ${
                data.mostActiveAgent?.agentId === agent.agentId
                  ? 'border-green-300 ring-1 ring-green-200'
                  : 'border-gray-200'
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">{agent.agentName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {agent.totalFields} field(s) · {agent.updateCount} update(s)
                </p>
              </div>
              {data.mostActiveAgent?.agentId === agent.agentId && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Most active
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recent updates */}
      {data.recentUpdates.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-gray-700 mb-3">Recent Updates</h2>
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {data.recentUpdates.map((update) => (
              <div key={update.id} className="px-4 py-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{update.fieldName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {update.agentName}
                    {update.newStage && ` → ${update.newStage}`}
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

function StatCard({
  label,
  value,
  highlight = false
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className={`bg-white border rounded-xl p-4 ${highlight ? 'border-red-200' : 'border-gray-200'}`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-3xl font-semibold mt-1 ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}