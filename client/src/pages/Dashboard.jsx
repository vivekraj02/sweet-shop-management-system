import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../authContext.jsx'
import SweetCard from '../components/SweetCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [name, setName] = useState('')
  const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' })
  const [restockQuantities, setRestockQuantities] = useState({})

  useEffect(() => {
    if (!user) return;
    setLoading(true)
    api.getSweets().then(res => setSweets(res.data.sweets)).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  async function search(e) {
    e.preventDefault()
    setLoading(true)
    const params = {}
    if (name) params.name = name
    if (category) params.category = category
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    try {
      const res = await api.searchSweets(params)
      setSweets(res.data.sweets)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this sweet?')) return
    try {
      await api.deleteSweet(id)
      setSweets(sweets.filter(s => s._id !== id))
    } catch (err) {
      alert('Failed to delete sweet')
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      const payload = { name: newSweet.name, category: newSweet.category, price: parseFloat(newSweet.price) || 0, quantity: parseInt(newSweet.quantity) || 0 }
      const res = await api.createSweet(payload)
      setSweets([...sweets, res.data.sweet])
      setNewSweet({ name: '', category: '', price: '', quantity: '' })
    } catch (err) {
      alert('Failed to create sweet')
    }
  }

  async function handleRestock(id) {
    const quantity = parseInt(restockQuantities[id]) || 0
    if (!quantity || quantity <= 0) return
    try {
      const res = await api.restockSweet(id, { quantity })
      setSweets(sweets.map(s => s._id === id ? res.data.sweet : s))
      setRestockQuantities({ ...restockQuantities, [id]: '' })
    } catch (err) {
      alert('Failed to restock sweet')
    }
  }

  return (
    <div className="page-soft-pink" style={{ paddingBottom: 40 }}>
      {!user ? (
        <div className="alert alert-info" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍭</div>
          <p>Please <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>login</a> or <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>register</a> to view sweets.</p>
        </div>
      ) : (
        <div>
          <div className="card mb-4 p-4" style={{ background: 'linear-gradient(90deg, rgba(217,70,239,0.08), rgba(6,182,212,0.08))' }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ fontSize: '2.5rem' }}>🍰</div>
              <div>
                <h2 style={{ margin: 0 }}>Welcome to Sweet Symphony</h2>
                <div className="text-muted">Discover new sweets, add to cart, and checkout securely</div>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h4>🍬 Browse Our Sweets</h4>
          </div>

          <form className="search-form" onSubmit={search}>
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <input className="form-control" placeholder="🔍 Search by name..." value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="col-md-2">
                <input className="form-control" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="col-md-2">
                <input className="form-control" placeholder="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </div>
              <div className="col-md-2">
                <input className="form-control" placeholder="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary me-2">Search</button>
                <button className="btn btn-secondary" onClick={(e) => { e.preventDefault(); setName(''); setCategory(''); setMinPrice(''); setMaxPrice(''); api.getSweets().then(r => setSweets(r.data.sweets)) }}>Reset</button>
              </div>
            </div>
          </form>

          {user.role === 'admin' && (
            <>
              <div className="card admin-section mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4">➕ Add New Sweet</h5>
                  <form className="row g-3" onSubmit={handleCreate}>
                    <div className="col-md-3">
                      <input className="form-control" placeholder="Sweet Name" value={newSweet.name} onChange={(e) => setNewSweet({ ...newSweet, name: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                      <input className="form-control" placeholder="Category" value={newSweet.category} onChange={(e) => setNewSweet({ ...newSweet, category: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                      <input className="form-control" placeholder="Price" type="number" step="0.01" value={newSweet.price} onChange={(e) => setNewSweet({ ...newSweet, price: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                      <input className="form-control" placeholder="Qty" type="number" value={newSweet.quantity} onChange={(e) => setNewSweet({ ...newSweet, quantity: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-success w-100">Add to Inventory</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card admin-section mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4">📦 Manage Stock</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sweet Name</th>
                          <th>Category</th>
                          <th>Current Stock</th>
                          <th>Add Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sweets.map(s => (
                          <tr key={s._id}>
                            <td>{s.name}</td>
                            <td>{s.category}</td>
                            <td>{s.quantity}</td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                min="1"
                                value={restockQuantities[s._id] || ''}
                                onChange={(e) => setRestockQuantities({ ...restockQuantities, [s._id]: e.target.value })}
                                placeholder="Qty to add"
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleRestock(s._id)}
                                disabled={!restockQuantities[s._id] || parseInt(restockQuantities[s._id]) <= 0}
                              >
                                Restock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="row">
            {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading sweets...</div>}
            {!loading && sweets.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No sweets found. Try adjusting your search.</div>}
            {sweets.map(s => (
              <div key={s._id} className="col-md-4 mb-4">
                <SweetCard sweet={s} onDelete={handleDelete} onChange={(updated) => {
                  setSweets(sweets.map(x => x._id === updated._id ? updated : x))
                }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
