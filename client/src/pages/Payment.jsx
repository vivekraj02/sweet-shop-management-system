import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../authContext.jsx'

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')

  const sweet = location.state?.sweet
  const quantity = location.state?.quantity || 1

  useEffect(() => {
    if (!sweet || !user) {
      navigate('/')
    }
  }, [sweet, user, navigate])

  if (!sweet) return null

  const total = sweet.price * quantity

  async function handlePayment() {
    if (!cardNumber || !expiry || !cvv || !name) {
      alert('Please fill all payment details')
      return
    }

    setLoading(true)
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Process the purchase
      const res = await api.purchaseSweet(sweet._id, { quantity })
      alert(`Payment successful! Purchased ${quantity} x ${sweet.name}`)
      navigate('/')
    } catch (err) {
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 relative overflow-hidden">
      <div className="body-blob" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card shadow-lg" style={{ borderRadius: 20 }}>
          <div className="card-header bg-primary text-white text-center">
            <h3>💳 Secure Payment</h3>
          </div>
          <div className="card-body p-4">
            <div className="mb-4">
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                <div>
                  <strong>{sweet.name}</strong>
                  <div className="text-muted">Quantity: {quantity}</div>
                </div>
                <div className="text-end">
                  <div className="fw-bold">₹{sweet.price} x {quantity}</div>
                  <div className="text-success fw-bold">Total: ₹{total}</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5>Payment Details</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  />
                </div>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-success btn-lg"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? '🔄 Processing Payment...' : `💳 Pay ₹${total}`}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
