import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFieldById, getFieldUpdates, reAssignField } from '../../api/field'
import FieldStatusBadge from '../../components/FieldStatusBadge'

export default function FieldDetailPage() {
  const { fieldId } = useParams<{ fieldId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = Number(fieldId)

  const [newAgentId, setNewAgentId] = useState('')
  const [reassignError, setReassignError] = useState<string | null>(null)
  const [reassignSuccess, setReassignSuccess] = useState(false)

  const { data: field, isLoading: fieldLoading } = useQuery({
    queryKey: ['admin-field', id],
    queryFn: () => getFieldById(id)
  })

  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ['field-updates', id],
    queryFn: () => getFieldUpdates(id),
    enabled: !!field
  })

  const reassignMutation = useMutation({
    mutationFn: () => reAssignField(id, Number(newAgentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-field', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-fields'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setNewAgentId('')
      setReassignError(null)
      setReassignSuccess(true)
      setTimeout(() => setReassignSuccess(false), 3000)
    },
    onError: (err: any) => {
      setReassignError(err.response?.data?.message || 'Failed to reassign field')
    }
  })

  const handleReassign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAgentId) return
    reassignMutation.mutate()
  }

  if (fieldLoading) return <p className="text-gray-500 text-sm">Loading field...</p>
  if (!field) return (
    <div className="text-center py-12">
      <p className="text-gray-400 text-sm">Field not found.</p>
      <button
        onClick={() => navigate('/admin/fields')}
        className="text-green-600 text-sm mt-2 hover:underline"
      >
        Back to fields
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/fields')}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Fields
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{field.name}</h1>
        <FieldStatusBadge status={field.status} />
      </div>

      {/* Field info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-400">Crop Type</p>
          <p className="text-sm font-medium text-gray-900 mt-1">{field.cropType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Planting Date</p>
          <p className="text-sm font-medium text-gray-900 mt-1">{field.plantingDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Current Stage</p>
          <p className="text-sm font-medium text-gray-900 mt-1">{field.stage}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Assigned Agent</p>
          <p className="text-sm font-medium text-gray-900 mt-1">
            {field.assignedAgentName}
            <span className="text-gray-400 ml-1">(ID: {field.assignedAgentId})</span>
          </p>
        </div>
      </div>

      {/* Reassign field */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Reassign Field</h2>
        <form onSubmit={handleReassign} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Agent ID
            </label>
            <input
              type="number"
              required
              value={newAgentId}
              onChange={(e) => setNewAgentId(e.target.value)}
              placeholder="Enter agent ID"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={reassignMutation.isPending || !newAgentId}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {reassignMutation.isPending ? 'Reassigning...' : 'Reassign'}
          </button>
        </form>
        {reassignError && (
          <p className="text-red-500 text-sm mt-2">{reassignError}</p>
        )}
        {reassignSuccess && (
          <p className="text-green-600 text-sm mt-2">Field reassigned successfully.</p>
        )}
      </div>

      {/* Updates timeline */}
      <div>
        <h2 className="text-base font-medium text-gray-700 mb-3">Update History</h2>
        {updatesLoading ? (
          <p className="text-gray-400 text-sm">Loading updates...</p>
        ) : !updates?.length ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm">No updates yet for this field.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {updates.map((update) => (
              <div key={update.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{update.agentName}</p>
                    {update.newStage && (
                      <p className="text-xs text-blue-600 mt-0.5">
                        Stage updated to {update.newStage}
                      </p>
                    )}
                    {update.note && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{update.note}"</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {new Date(update.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}