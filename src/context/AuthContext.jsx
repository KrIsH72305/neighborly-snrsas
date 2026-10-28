import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { dbService } from '../services/dbService'
import { LocalStore } from '../services/localStorageStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const isDemo = dbService.isDemoMode()

  const refreshUser = useCallback(async () => {
    try {
      const current = await dbService.getCurrentUser()
      setUser(current)
    } catch (e) {
      console.error('Failed to load current user:', e)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()

    const handleAuthChange = () => {
      refreshUser()
    }

    window.addEventListener('snrsas_auth_changed', handleAuthChange)
    window.addEventListener('snrsas_data_changed', handleAuthChange)

    return () => {
      window.removeEventListener('snrsas_auth_changed', handleAuthChange)
      window.removeEventListener('snrsas_data_changed', handleAuthChange)
    }
  }, [refreshUser])

  const login = async (email, password) => {
    setLoading(true)
    const res = await dbService.login(email, password)
    if (res.user) {
      setUser(res.user)
    }
    setLoading(false)
    return res
  }

  const register = async (formData) => {
    setLoading(true)
    const res = await dbService.register(formData)
    if (res.user) {
      setUser(res.user)
    }
    setLoading(false)
    return res
  }

  const logout = async () => {
    await dbService.logout()
    setUser(null)
  }

  const switchDemoUser = (userId) => {
    dbService.switchDemoUser(userId)
    refreshUser()
  }

  const resetDemoData = () => {
    dbService.resetDemoData()
    refreshUser()
  }

  const value = {
    user,
    loading,
    isDemo,
    login,
    register,
    logout,
    switchDemoUser,
    resetDemoData,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
