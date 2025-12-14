import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../authContext.jsx'

export default function Register() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.register({ email, password, role })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-soft-pink-alt auth-center">
      <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
          <div className="card mx-auto" style={{ border: '2px solid rgba(217, 70, 239, 0.12)' }}>
            <div className="card-body p-0 d-flex" style={{ overflow: 'hidden', alignItems: 'stretch' }}>
              <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Join Sweet Symphony!</h4>
                <p className="text-muted">Create your account to get started</p>
              </div>

              {error && <div className="alert alert-danger mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label" style={{ display: 'block', textAlign: 'center' }}>📧 Email Address</label>
                  <input
                    type="email"
                    className="form-control mx-auto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{ textAlign: 'center', maxWidth: 360 }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ display: 'block', textAlign: 'center' }}>🔒 Password</label>
                  <input
                    type="password"
                    className="form-control mx-auto"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ textAlign: 'center', maxWidth: 360 }}
                  />
                  <small className="form-text">Minimum 6 characters</small>
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ display: 'block', textAlign: 'center' }}>👥 Account Type</label>
                  <select
                    className="form-select mx-auto"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ maxWidth: 360 }}
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <small className="form-text">Admins can manage sweets inventory</small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={loading}
                  style={{ fontSize: '1rem' }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p className="text-muted mb-0">
                  Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in here</a>
                </p>
              </div>
            </div>
            <div className="d-none d-md-block" style={{ width: 240, backgroundImage: 'url(https://source.unsplash.com/collection/1127163/600x600?sig=' + Math.floor(Math.random()*10000) + ')', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
