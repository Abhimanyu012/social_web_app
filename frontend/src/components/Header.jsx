import React from 'react'
import { LogOut, Home, User, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  const getUserInitials = (userName) => {
    if (!userName) return 'U'
    return userName.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          <Home size={28} className="me-2" />
          SocialApp
        </a>

        <div className="d-flex align-items-center">
          {/* Search bar (optional - can be added later) */}
          <div className="d-none d-md-block me-3">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-3 translate-middle-y text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search..."
                style={{ borderRadius: '20px', borderColor: '#e2e8f0' }}
              />
            </div>
          </div>

          {/* User info and logout */}
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <div className="profile-avatar me-2">
                {getUserInitials(user?.userName)}
              </div>
              <div className="d-none d-sm-block">
                <div className="fw-semibold small">{user?.userName}</div>
                <div className="text-muted small">{user?.email}</div>
              </div>
            </div>
            
            <button
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={logout}
              title="Logout"
            >
              <LogOut size={16} className="me-1" />
              <span className="d-none d-md-inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
