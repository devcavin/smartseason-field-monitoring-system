import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getMyFields } from '../../api/field'
import FieldStatusBadge from '../../components/FieldStatusBadge'

export default function MyFieldsPage() {
  const navigate = useNavigate()

  const { data: fields, isLoading } = useQuery({
    queryKey: ['agent-fields'],
    queryFn: getMyFields
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">My Fields</h1>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading fields...</p>
      ) : !fields?.length ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">No fields assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{field.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{field.cropType}</p>
                </div>
                <FieldStatusBadge status={field.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                <div>
                  <p className="text-gray-400">Planted</p>
                  <p className="font-medium text-gray-700 mt-0.5">{field.plantingDate}</p>
                </div>
                <div>
                  <p className="text-gray-400">Stage</p>
                  <p className="font-medium text-gray-700 mt-0.5">{field.stage}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/agent/fields/${field.id}/update`)}
                className="w-full text-center text-sm text-green-600 border border-green-200 rounded-lg py-2 hover:bg-green-50 transition-colors"
              >
                Add Update
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}