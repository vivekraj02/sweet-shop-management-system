import React, { useState } from 'react'
import api from '../api'
import { useAuth } from '../authContext.jsx'

export default function SweetCard({ sweet, onDelete, onChange }) {
  const { user } = useAuth()
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)

  async function purchase() {
    setLoading(true)
    const res = await api.purchaseSweet(sweet._id, { quantity: qty })
    onChange(res.data.sweet)
    setLoading(false)
  }

  async function restock() {
    const amount = parseInt(prompt('Restock amount', '1') || '0', 10)
    if (!amount) return
    setLoading(true)
    const res = await api.restockSweet(sweet._id, { quantity: amount })
    onChange(res.data.sweet)
    setLoading(false)
  }

  async function updatePrice() {
    const price = parseFloat(prompt('New price', String(sweet.price)))
    if (!price && price !== 0) return
    setLoading(true)
    const res = await api.updateSweet(sweet._id, { price })
    onChange(res.data.sweet)
    setLoading(false)
  }

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{sweet.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{sweet.category}</h6>
        <p className="card-text mt-auto">Price: ${sweet.price.toFixed(2)} | Qty: {sweet.quantity}</p>
        <div className="d-flex gap-2">
          <input type="number" className="form-control form-control-sm" style={{width: '80px'}} min={1} max={sweet.quantity} value={qty} onChange={(e)=>setQty(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={purchase} disabled={loading || sweet.quantity===0}>Purchase</button>
          {user?.role === 'admin' && (
            <>
              <button className="btn btn-outline-secondary btn-sm" onClick={restock}>Restock</button>
              <button className="btn btn-outline-warning btn-sm" onClick={updatePrice}>Edit Price</button>
              <button className="btn btn-outline-danger btn-sm" onClick={()=>onDelete(sweet._id)}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
