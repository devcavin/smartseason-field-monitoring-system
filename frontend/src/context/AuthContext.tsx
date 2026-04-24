import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponse, UserRole } from '../types'

interface AuthUser {
  token: string
  username: string
  fullName: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  login: (data: AuthResponse) => void
  logout: () => void
  isAdmin: boolean
  isAgent: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (data: AuthResponse) => {
    const authUser: AuthUser = {
      token: data.token,
      username: data.username,
      fullName: data.fullName,
      role: data.role
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(authUser))
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin: user?.role === 'ADMIN',
      isAgent: user?.role === 'AGENT'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}