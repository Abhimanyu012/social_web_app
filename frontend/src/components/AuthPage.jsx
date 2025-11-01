import React, { useState } from 'react'
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const { login, signup, loading } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin && !formData.userName) {
      newErrors.userName = 'Username is required'
    } else if (!isLogin && formData.userName.length < 2) {
      newErrors.userName = 'Username must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const { userName, email, password } = formData
    
    if (isLogin) {
      await login(email, password)
    } else {
      await signup(userName, email, password)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (loading) {
    return <LoadingSpinner text="Authenticating..." />
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}>
                    {isLogin ? (
                      <LogIn size={32} className="text-white" />
                    ) : (
                      <UserPlus size={32} className="text-white" />
                    )}
                  </div>
                  <h2 className="fw-bold mb-2" style={{ color: '#667eea' }}>
                    {isLogin ? 'Welcome Back' : 'Join SocialApp'}
                  </h2>
                  <p className="text-muted">
                    {isLogin 
                      ? 'Sign in to connect with friends' 
                      : 'Create an account to get started'
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label fw-semibold">
                        Username
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <UserPlus size={16} />
                        </span>
                        <input
                          type="text"
                          className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
                          id="userName"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          placeholder="Enter your username"
                        />
                        {errors.userName && (
                          <div className="invalid-feedback d-block">
                            {errors.userName}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 mb-3 fw-bold text-white"
                    style={{ backgroundColor: '#667eea', borderColor: '#667eea' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        {isLogin ? <LogIn size={16} className="me-2" /> : <UserPlus size={16} className="me-2" />}
                        {isLogin ? 'Sign In' : 'Sign Up'}
                      </div>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none fw-semibold ms-1"
                      onClick={() => {
                        setIsLogin(!isLogin)
                        setFormData({ userName: '', email: '', password: '' })
                        setErrors({})
                      }}
                      style={{ color: '#667eea' }}
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
