import React from 'react'
import { useAuth } from './context/AuthContext'
import AuthPage from './components/AuthPage'
import SocialFeed from './components/SocialFeed'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated()) {
    return <AuthPage />
  }

  return <SocialFeed />
}

export default App
