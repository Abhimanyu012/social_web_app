import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('currentUser')
    const storedToken = localStorage.getItem('authToken')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.login(email, password)
      
      if (response.success) {
        const { user, token } = response
        setUser(user)
        setToken(token)
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', JSON.stringify(user))
        toast.success('Welcome back!')
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userName, email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.signup(userName, email, password)
      
      if (response.success) {
        const { user, token } = response
        setUser(user)
        setToken(token)
        localStorage.setItem('authToken', token)
        localStorage.setItem('currentUser', JSON.stringify(user))
        toast.success('Account created successfully!')
        return { success: true }
      }
      
      return { success: false, message: response.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    toast.success('Logged out successfully')
  }

  const isAuthenticated = () => {
    return !!user && !!token
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
