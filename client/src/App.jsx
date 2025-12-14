import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import IndianSweetShop from './pages/IndianSweetShop'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Footer from './components/Footer'
import { useAuth } from './authContext.jsx'
import { useCart } from './contexts/CartContext'
import { useWishlist } from './contexts/WishlistContext'

export default function App() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="body-blob" />
      <nav className="d-flex justify-content-between align-items-center mb-4">        <h3 className="d-flex align-items-center gap-2"><span className="animate-bounce">🎶</span> Sweet Symphony</h3>
        <div className="d-flex align-items-center gap-3">
          <Link to="/wishlist" className="btn btn-outline-light btn-sm">Wishlist ({wishlistItems.length})</Link>
          <Link to="/cart" className="btn btn-outline-light btn-sm">Cart ({items.length})</Link>
          {user ? (
            <>
              <span>👤 {user.email} <strong>({user.role})</strong></span>
              <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
              <Link className="btn btn-light btn-sm" to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<IndianSweetShop />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
