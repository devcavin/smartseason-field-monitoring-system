import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllFields, createField, deleteField } from '../../api/field'
import FieldStatusBadge from '../../components/FieldStatusBadge'
import type { FieldStage } from '../../types'

export default function FieldsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', cropType: '', plantingDate: '', agentId: '', stage: ''
  })
  const [formError, setFormError] = useState<string | null>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: fields, isLoading } = useQuery({
    queryKey: ['admin-fields'],
    queryFn: getAllFields
  })

  const createMutation = useMutation({
    mutationFn: createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-fields'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      setShowForm(false)
      setForm({ name: '', cropType: '', plantingDate: '', agentId: '', stage: '' })
      setFormError(null)
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to create field')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-fields'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      name: form.name,
      cropType: form.cropType,
      plantingDate: form.plantingDate,
      agentId: Number(form.agentId),
      stage: form.stage || undefined
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Fields</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Field'}
        </button>
      </div>

      {/* Create field form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">Create Field</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
              <input
                type="text"
                required
                value={form.cropType}
                onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={form.plantingDate}
                onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
              <input
                type="number"
                required
                value={form.agentId}
                onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stage <span className="text-gray-400">(optional, defaults to PLANTED)</span>
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">PLANTED</option>
                {(['GROWING', 'READY', 'HARVESTED'] as FieldStage[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {formError && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {formError}
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Field'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fields table */}
      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading fields...</p>
      ) : !fields?.length ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No fields yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Crop</th>
                <th className="text-left px-4 py-3 font-medium">Planted</th>
                <th className="text-left px-4 py-3 font-medium">Stage</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Agent</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{field.name}</td>
                  <td className="px-4 py-3 text-gray-600">{field.cropType}</td>
                  <td className="px-4 py-3 text-gray-600">{field.plantingDate}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {field.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <FieldStatusBadge status={field.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{field.assignedAgentName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/fields/${field.id}`)}
                        className="text-xs text-green-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete field "${field.name}"?`)) {
                            deleteMutation.mutate(field.id)
                          }
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}