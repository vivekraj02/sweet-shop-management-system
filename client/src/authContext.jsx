import React, { createContext, useContext, useState, useEffect } from 'react'
import api from './api'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.setToken(token)
    } else {
      localStorage.removeItem('token')
      api.setToken(null)
    }
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user')
  }, [user])

  function login(token, user) {
    setToken(token)
    setUser(user)
  }
  function logout() {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
