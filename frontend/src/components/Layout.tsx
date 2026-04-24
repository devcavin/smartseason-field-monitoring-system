import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-green-700 text-lg">🌱 SmartSeason</span>
          {isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-green-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/fields"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-green-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Fields
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/agent/dashboard"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-green-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/agent/fields"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-green-700 font-medium' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                My Fields
              </NavLink>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.fullName}</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}