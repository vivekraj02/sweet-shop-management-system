import React, { useState } from 'react'
import api from '../api'
import { useAuth } from '../authContext.jsx'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getSweetImage } from '../utils/sweetImages'

export default function SweetCard({ sweet, onDelete, onChange }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlist()
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const isOutOfStock = sweet.quantity === 0
  const isWishlisted = wishlistItems.some(i => i._id === sweet._id)



  async function purchase() {
    if (isOutOfStock) return
    setLoading(true)
    try {
      const res = await api.purchaseSweet(sweet._id, { quantity: parseInt(qty) })
      onChange(res.data.sweet)
      setQty(1)
    } catch (err) {
      alert('Failed to purchase sweet')
    } finally {
      setLoading(false)
    }
  }

  async function restock() {
    const amount = parseInt(prompt('Restock amount:', '10') || '0', 10)
    if (!amount || amount <= 0) return
    setLoading(true)
    try {
      const res = await api.restockSweet(sweet._id, { quantity: amount })
      onChange(res.data.sweet)
    } catch (err) {
      alert('Failed to restock')
    } finally {
      setLoading(false)
    }
  }

  async function updatePrice() {
    const newPrice = parseFloat(prompt('New price ($):', String(sweet.price)))
    if (newPrice === null || (newPrice !== 0 && !newPrice)) return
    if (newPrice < 0) { alert('Price must be non-negative'); return }
    setLoading(true)
    try {
      const res = await api.updateSweet(sweet._id, { price: newPrice })
      onChange(res.data.sweet)
    } catch (err) {
      alert('Failed to update price')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card h-100" style={{ borderTop: '4px solid var(--primary)' }}>
      <div className="card-body d-flex flex-column">
        <div style={{ marginBottom: '1rem' }}>
          {sweet.image && String(sweet.image).startsWith('http') ? (
            <div style={{ width: '100%', height: 140, marginBottom: '0.75rem', overflow: 'hidden', borderRadius: 8 }}>
              <img src={sweet.image} alt={sweet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>{getSweetImage(sweet.name)}</div>
          )}

          <h5 className="card-title mb-1">{sweet.name}</h5>
          <h6 className="card-subtitle" style={{ color: 'var(--secondary)', fontWeight: 600 }}>{sweet.category}</h6>
        </div>

        <div style={{ marginBottom: '1rem', flex: 1 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            ${sweet.price.toFixed(2)}
          </div>
          <div style={{ padding: '0.75rem', background: isOutOfStock ? '#fee2e2' : '#ecfdf5', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
            {isOutOfStock ? (
              <span style={{ color: '#991b1b' }}>❌ Out of Stock</span>
            ) : (
              <span style={{ color: '#065f46' }}>✓ {sweet.quantity} in stock</span>
            )}
          </div>
        </div>

        <div>
          {!isOutOfStock && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Quantity</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={sweet.quantity}
                value={qty}
                onChange={(e) => setQty(Math.min(sweet.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                style={{ marginBottom: '0.5rem' }}
              />
            </div>
          )}

          <div className="d-grid gap-2 mb-2">
            <button
              className="btn btn-primary"
              onClick={purchase}
              disabled={loading || isOutOfStock}
              style={{ fontWeight: 600 }}
            >
              {loading ? '🔄 Processing...' : '🛒 Buy Now'}
            </button>
            <button
              className="btn btn-outline-success"
              onClick={async () => {
                setCartLoading(true)
                try {
                  addToCart(sweet, qty)
                } finally {
                  setCartLoading(false)
                }
              }}
              disabled={isOutOfStock || cartLoading}
              style={{ fontWeight: 600 }}
            >
              {cartLoading ? '🔄 Adding...' : '➕ Add to Cart'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 8 }}>
            <button
              className={isWishlisted ? 'btn btn-outline-danger btn-sm' : 'btn btn-outline-primary btn-sm'}
              onClick={async () => {
                setWishlistLoading(true)
                try {
                  toggleWishlist(sweet)
                } finally {
                  setWishlistLoading(false)
                }
              }}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? '🔄 Updating...' : (isWishlisted ? '♥ Wishlist' : '♡ Wishlist')}
            </button>
          </div>

          {user?.role === 'admin' && (
            <div className="admin-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={restock}
                disabled={loading}
                style={{ fontWeight: 600 }}
              >
                📦 Restock
              </button>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={updatePrice}
                disabled={loading}
                style={{ fontWeight: 600 }}
              >
                💰 Edit Price
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(sweet._id)}
                disabled={loading}
                style={{ fontWeight: 600, gridColumn: '1 / -1' }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
