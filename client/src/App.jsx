import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { useAuth } from './authContext.jsx'

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="container py-4">
      <nav className="d-flex justify-content-between mb-4">
        <h3>Sweet Shop</h3>
        <div>
          {user ? (
            <>
              <span className="me-2">{user.email} ({user.role})</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-primary btn-sm me-2" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}
