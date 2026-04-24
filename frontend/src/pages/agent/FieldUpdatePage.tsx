import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyFieldById, addFieldUpdate, getMyFieldUpdates } from '../../api/field'
import FieldStatusBadge from '../../components/FieldStatusBadge'
import type { FieldStage } from '../../types'

export default function FieldUpdatePage() {
  const { fieldId } = useParams<{ fieldId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const id = Number(fieldId)

  const [newStage, setNewStage] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { data: field, isLoading: fieldLoading } = useQuery({
    queryKey: ['agent-field', id],
    queryFn: () => getMyFieldById(id)
  })

  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ['agent-field-updates', id],
    queryFn: () => getMyFieldUpdates(id),
    enabled: !!field
  })

  const mutation = useMutation({
    mutationFn: () => addFieldUpdate(id, {
      newStage: newStage || undefined,
      note: note.trim() || undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-field', id] })
      queryClient.invalidateQueries({ queryKey: ['agent-fields'] })
      queryClient.invalidateQueries({ queryKey: ['agent-field-updates', id] })
      queryClient.invalidateQueries({ queryKey: ['agent-dashboard'] })
      setNewStage('')
      setNote('')
      setError(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to submit update')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStage && !note.trim()) {
      setError('Please provide a stage update or a note')
      return
    }
    setError(null)
    mutation.mutate()
  }

  const stages: FieldStage[] = ['PLANTED', 'GROWING', 'READY', 'HARVESTED']

  if (fieldLoading) return <p className="text-gray-500 text-sm">Loading field...</p>

  if (!field) return (
    <div className="text-center py-12">
      <p className="text-gray-400 text-sm">Field not found.</p>
      <button
        onClick={() => navigate('/agent/fields')}
        className="text-green-600 text-sm mt-2 hover:underline"
      >
        Back to my fields
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/agent/fields')}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← My Fields
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{field.name}</h1>
        <FieldStatusBadge status={field.status} />
      </div>

      {/* Field info */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-400">Crop</p>
          <p className="font-medium text-gray-900 mt-0.5">{field.cropType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Planted</p>
          <p className="font-medium text-gray-900 mt-0.5">{field.plantingDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Current Stage</p>
          <p className="font-medium text-gray-900 mt-0.5">{field.stage}</p>
        </div>
      </div>

      {/* Update form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Add Update</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Stage
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">No stage change</option>
              {stages
                .filter((s) => {
                  const order = ['PLANTED', 'GROWING', 'READY', 'HARVESTED']
                  return order.indexOf(s) === order.indexOf(field.stage) + 1
                })
                .map(s => (
                  <option key={s} value={s}>{s}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observation Note
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Describe what you observed in the field..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{note.length}/1000</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              Update submitted successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            {mutation.isPending ? 'Submitting...' : 'Submit Update'}
          </button>
        </form>
      </div>

      {/* Update history */}
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
              <div key={update.id} className="px-5 py-4 flex items-start justify-between">
                <div>
                  {update.newStage && (
                    <p className="text-xs font-medium text-blue-600">
                      Stage → {update.newStage}
                    </p>
                  )}
                  {update.note && (
                    <p className="text-sm text-gray-600 mt-0.5 italic">
                      "{update.note}"
                    </p>
                  )}
                  {!update.newStage && !update.note && (
                    <p className="text-xs text-gray-400 italic">No details recorded</p>
                  )}
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {new Date(update.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}