import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import FieldsPage from './pages/admin/FieldsPage'
import FieldDetailPage from './pages/admin/FieldDetailPage'
import AgentDashboard from './pages/agent/AgentDashboard'
import MyFieldsPage from './pages/agent/MyFieldsPage'
import FieldUpdatePage from './pages/agent/FieldUpdatePage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/agent/dashboard'} /> : <LoginPage />
      } />

      {/* Admin routes */}
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/fields" element={<FieldsPage />} />
          <Route path="/admin/fields/:fieldId" element={<FieldDetailPage />} />
        </Route>
      </Route>

      {/* Agent routes */}
      <Route element={<ProtectedRoute role="AGENT" />}>
        <Route element={<Layout />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/fields" element={<MyFieldsPage />} />
          <Route path="/agent/fields/:fieldId/update" element={<FieldUpdatePage />} />
        </Route>
      </Route>

      <Route path="*" element={
        <Navigate to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/agent/dashboard') : '/login'} />
      } />
    </Routes>
  )
}