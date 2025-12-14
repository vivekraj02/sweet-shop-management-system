import React, { useState, useEffect } from 'react'
import { Search, ShoppingCart, Plus, Minus, Sparkles, Crown, LogIn, UserPlus, Menu, X } from 'lucide-react'
import api from '../api'
import { useAuth } from '../authContext.jsx'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

export default function IndianSweetShop() {
  const [sweets, setSweets] = useState([])
  const [selectedSweet, setSelectedSweet] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [animateItems, setAnimateItems] = useState(false)

  const { user, login } = useAuth()
  const { items: cartItems, addToCart, clearCart } = useCart()
  const { items: wishlist, toggle: toggleWishlist } = useWishlist()

  useEffect(() => {
    fetchSweets()
    setAnimateItems(true)
  }, [])

  async function fetchSweets() {
    try {
      const res = await api.getSweets()
      setSweets(res.data.sweets)
    } catch (err) {
      // fallback to demo data
      setSweets([ { _id: '1', name: 'Gulab Jamun', category: 'Traditional', price: 120, quantity: 15, image: 'https://source.unsplash.com/featured/?gulabjamun' } ])
    }
  }

  async function handleAuthSubmit() {
    setAuthLoading(true)
    setAuthError(null)
    try {
      if (authMode === 'login') {
        const res = await api.login({ email: authEmail, password: authPassword })
        login(res.data.token, res.data.user)
      } else {
        const res = await api.register({ email: authEmail, password: authPassword, role: 'user' })
        login(res.data.token, res.data.user)
      }
      setShowAuth(false)
      setAuthEmail('')
      setAuthPassword('')
      fetchSweets()
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const filteredSweets = sweets.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 relative overflow-hidden">
      <div className="body-blob" />
      {/* Hero (uses unified nav for branding) */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="card p-4" style={{ borderRadius: 12, background: 'linear-gradient(90deg, rgba(255,136,184,0.08), rgba(255,240,245,0.04))' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 style={{ margin: 0, fontFamily: 'cursive' }}>Welcome to Sweet Symphony</h2>
              <div className="text-muted">Sweetness in every bite — browse our curated selection.</div>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button onClick={() => { setShowAuth(true); setAuthMode('login') }} className="btn btn-outline-light">Login</button>
              <button onClick={() => setShowCart(true)} className="btn btn-primary">Cart ({totalItems})</button>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="position-relative mx-auto" style={{ maxWidth: 720 }}>
          <Search className="position-absolute" style={{ left: 20, top: 16, color: '#fb923c' }} size={20} />
          <input placeholder="Search for your favorite sweets..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="form-control ps-5 pe-4 py-3 rounded-pill shadow" />
          <Sparkles className="position-absolute" style={{ right: 16, top: 16, color: '#fb7185' }} size={20} />
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-center mb-4" style={{ fontFamily: 'cursive' }}>✨ Our Delicious Collection ✨</h2>
        <div className="row g-4">
          {filteredSweets.map((s, idx) => (
            <div className="col-12 col-sm-6 col-lg-3" key={s._id}>
              <div className={`card shadow-sm h-100`} style={{ borderRadius: 20 }}>
                <div className="p-4" style={{ background: 'linear-gradient(90deg,#ffedd5,#fbcfe8)', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                  <div className="text-center fs-1">{s.image && String(s.image).startsWith('http') ? <img src={s.image} alt={s.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12 }} /> : (s.image || '🍬')}</div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{s.name}</h5>
                  <p className="text-muted mb-2">{s.category}</p>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="fw-bold text-success">₹{s.price}</div>
                    <div className="badge bg-warning text-dark">Stock: {s.quantity}</div>
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-gradient text-white" onClick={() => addToCart(s)} disabled={s.quantity===0}>Add to Cart</button>
                    <button className="btn btn-outline-danger" onClick={() => toggleWishlist(s)}>♡ Wishlist</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Slide */}
      {showCart && (
        <div className="position-fixed inset-0 d-flex justify-content-end" style={{ zIndex: 1050 }}>
          <div className="bg-white" style={{ width: '360px', height: '100vh', boxShadow: 'rgba(0,0,0,0.2) 0 0 30px' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h4>Your Cart</h4>
              <button className="btn" onClick={() => setShowCart(false)}><X /></button>
            </div>
            <div className="p-4 overflow-auto" style={{ height: 'calc(100vh - 220px)' }}>
              {cartItems.length === 0 ? <div className="text-center text-muted">Cart is empty</div> : cartItems.map(it => (
                <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                  <div>
                    <div className="fs-6 fw-bold">{it.name}</div>
                    <div className="text-muted small">₹{it.price} x {it.quantity}</div>
                  </div>
                  <div className="fw-bold">₹{it.price * it.quantity}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-top">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-bold">Total</div>
                <div className="fw-bold text-success">₹{totalPrice}</div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success" onClick={() => { alert('Checkout mocked'); clearCart(); setShowCart(false) }}>Proceed to Checkout</button>
                <button className="btn btn-outline-secondary" onClick={() => { clearCart() }}>Clear</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="position-fixed inset-0 d-flex align-items-center justify-content-center" style={{ zIndex: 1060 }}>
            <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: 420, textAlign: 'center' }}>
              <div className="mb-3">
                <h3 style={{ marginBottom: 8 }}>{authMode === 'login' ? 'Login' : 'Register'}</h3>
              </div>
              <div className="mb-3">
                {authError && <div className="alert alert-danger text-center">{authError}</div>}
                <input className="form-control mb-2 mx-auto" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ textAlign: 'center' }} />
                <input className="form-control mb-2 mx-auto" placeholder="Password" type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ textAlign: 'center' }} />
                <button className="btn btn-primary w-100" onClick={handleAuthSubmit} disabled={authLoading}>{authLoading ? 'Please wait...' : 'Submit'}</button>
              </div>
              <div className="text-center mt-2">
                <button className="btn btn-link" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>{authMode === 'login' ? "New user?" : 'Have an account?'}</button>
              </div>
          </div>
        </div>
      )}

    </div>
  )
}
