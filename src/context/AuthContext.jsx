import { createContext, useContext, useState, useCallback } from 'react'
import config from '../config'
import coreApi from '../services/coreApi'

const AuthContext = createContext(null)

function saveToken(t) {
  if (t) localStorage.setItem(config.authTokenKey, t)
  else localStorage.removeItem(config.authTokenKey)
}

function saveUser(u) {
  if (u) localStorage.setItem(config.authUserKey, JSON.stringify(u))
  else localStorage.removeItem(config.authUserKey)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(config.authUserKey)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setTokenState] = useState(() => {
    try {
      return localStorage.getItem(config.authTokenKey) || config.authToken || null
    } catch {
      return config.authToken || null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = !!token

  const setToken = useCallback((t) => {
    saveToken(t)
    setTokenState(t)
  }, [])

  const setUserAndPersist = useCallback((u) => {
    saveUser(u)
    setUser(u)
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await coreApi.auth.login(email, password)
      const newToken = response?.data?.token || response?.data?.access_token
      const userData = response?.data?.user || response?.data
      if (newToken) setToken(newToken)
      if (userData) setUserAndPersist(userData)
      return response
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await coreApi.auth.logout()
    } catch {
    } finally {
      setToken(null)
      setUserAndPersist(null)
      setError(null)
    }
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      const response = await coreApi.auth.me()
      const userData = response?.data
      if (userData) setUserAndPersist(userData)
      return userData
    } catch {
      setToken(null)
      setUserAndPersist(null)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{
      user, token, loading, error, isAuthenticated,
      login, logout, fetchUser, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
