import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../authContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.login({ email, password })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-soft-pink-alt auth-center">
      <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
        <div className="card mx-auto" style={{ border: '2px solid rgba(217, 70, 239, 0.12)' }}>
          <div className="card-body p-0 d-flex align-items-stretch" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '2rem', flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍬</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Welcome Back!</h4>
                <p className="text-muted">Sign in to your Sweet Symphony account</p>
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
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={loading}
                  style={{ fontSize: '1rem' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p className="text-muted mb-0">
                  Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up here</a>
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
