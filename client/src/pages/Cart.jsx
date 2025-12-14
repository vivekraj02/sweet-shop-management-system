import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../authContext.jsx'
import api from '../api'
import { getSweetImage } from '../utils/sweetImages'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', exp: '' })

  const total = items.reduce((s, i) => s + (i.price * i.quantity), 0)

  function validateCard() {
    // Very simple validation for UI demo purposes
    if (paymentMethod !== 'card') return true
    return cardDetails.number.replace(/\s+/g, '').length >= 12 && cardDetails.name && cardDetails.exp
  }

  async function handleCheckout() {
    if (!user) { alert('Please login to checkout'); return }
    if (!validateCard()) { alert('Please enter valid payment details'); return }
    setLoading(true)
    try {
      // Simulate payment processing delay
      await new Promise(r => setTimeout(r, 800))
      // Call purchase for each item after 'payment'
      for (const item of items) {
        await api.purchaseSweet(item._id, { quantity: item.quantity })
      }
      alert('Payment successful and items purchased!')
      clearCart()
    } catch (err) {
      console.error(err)
      alert('Checkout failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4>Your Cart</h4>
      {items.length === 0 && <div className="alert alert-info">Cart is empty.</div>}
      {items.map(i => (
        <div key={i._id} className="card mb-3 p-3 d-flex flex-row align-items-center">
          <div style={{ width: 90, height: 90, marginRight: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', borderRadius: 8, background: 'linear-gradient(135deg, rgba(255,204,229,0.1), rgba(255,240,245,0.08))' }}>
            {i.image && String(i.image).startsWith('http') ? (
              <img src={i.image} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
            ) : (
              getSweetImage(i.name)
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{i.name}</div>
            <div className="text-muted">{i.category}</div>
            <div style={{ marginTop: 8 }}>₹{i.price.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="number" value={i.quantity} min={1} max={i.quantity} onChange={(e)=>updateQuantity(i._id, Math.max(1, parseInt(e.target.value)||1))} style={{ width: 80 }} />
            <button className="btn btn-outline-danger btn-sm" onClick={()=>removeFromCart(i._id)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="card p-3 mb-3">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total: ₹{total.toFixed(2)}</div>
            <div className="text-muted">Secure payments powered by a mock gateway for demo purposes</div>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 align-items-center justify-content-end">
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="form-select" style={{ width: 180 }}>
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
                <option value="wallet">Wallet</option>
              </select>
              <button className="btn btn-secondary me-2" onClick={()=>clearCart()} disabled={items.length===0}>Clear</button>
              <button className="btn btn-primary" onClick={handleCheckout} disabled={items.length===0 || loading}>{loading ? 'Processing…' : 'Checkout'}</button>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-3">
                <input className="form-control mb-2" placeholder="Card number" value={cardDetails.number} onChange={e => setCardDetails(s => ({ ...s, number: e.target.value }))} />
                <div className="d-flex gap-2">
                  <input className="form-control" placeholder="Name on card" value={cardDetails.name} onChange={e => setCardDetails(s => ({ ...s, name: e.target.value }))} />
                  <input className="form-control" placeholder="MM/YY" value={cardDetails.exp} onChange={e => setCardDetails(s => ({ ...s, exp: e.target.value }))} style={{ width: 120 }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
