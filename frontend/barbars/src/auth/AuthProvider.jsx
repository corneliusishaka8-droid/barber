import { useCallback, useEffect, useMemo, useState } from 'react'
import API__url from '../api.js'
import { AuthContext } from './authContext.js'
import './AuthContext.css'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const checkSession = async () => {
      try {
        const response = await fetch(`${API__url}/session`, { credentials: 'include' })
        const result = response.ok ? await response.json() : null
        if (active) setUser(result?.user || null)
      } catch {
        if (active) setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    checkSession()
    return () => { active = false }
  }, [])

  const logout = useCallback(async () => {
    const response = await fetch(`${API__url}/logout`, { method: 'POST', credentials: 'include' })
    if (!response.ok) throw new Error('Could not end your session. Please try again.')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, setUser, loading, logout }), [user, loading, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
