import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../authContext.jsx'
import SweetCard from '../components/SweetCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [sweets, setSweets] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    if (!user) return;
    api.getSweets().then(res => setSweets(res.data.sweets)).catch(()=>{});
  }, [user])

  async function search(e) {
    e.preventDefault()
    const params = { }
    if (name) params.name = name
    if (category) params.category = category
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    const res = await api.searchSweets(params)
    setSweets(res.data.sweets)
  }

  async function handleDelete(id) {
    if (!confirm('Delete sweet?')) return
    await api.deleteSweet(id)
    setSweets(sweets.filter(s=>s._id !== id))
  }

  async function handleCreate(e) {
    e.preventDefault()
    const payload = { name, category, price: parseFloat(minPrice) || 0, quantity: parseInt(maxPrice) || 0 }
    const res = await api.createSweet(payload)
    setSweets([...sweets, res.data.sweet])
  }

  return (
    <div>
      {!user ? (
        <div className="alert alert-info">Please login or register.</div>
      ) : (
        <div>
          <h4>Available Sweets</h4>
          <form className="row g-2 mb-3" onSubmit={search}>
            <div className="col-md-3">
              <input className="form-control" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Min Price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Max Price" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary me-2">Search</button>
              <button className="btn btn-secondary" onClick={(e)=>{e.preventDefault(); api.getSweets().then(r=>setSweets(r.data.sweets))}}>Reset</button>
            </div>
          </form>

          {user.role === 'admin' && (
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Add New Sweet (Admin)</h5>
                <form className="row g-2" onSubmit={handleCreate}>
                  <div className="col-md-3">
                    <input className="form-control" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Category" value={category} onChange={(e)=>setCategory(e.target.value)} required />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Price" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} required />
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="Quantity" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} required />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-success">Add Sweet</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="row">
            {sweets.map(s => (
              <div key={s._id} className="col-md-4 mb-3">
                <SweetCard sweet={s} onDelete={handleDelete} onChange={(updated)=>{
                  setSweets(sweets.map(x=>x._id===updated._id ? updated : x))
                }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
