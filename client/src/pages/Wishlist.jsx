import React from 'react'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'

export default function Wishlist() {
  const { items, remove, toggle } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div>
      <h4>Your Wishlist</h4>
      {items.length === 0 && <div className="alert alert-info">Your wishlist is empty.</div>}
      <div className="row">
        {items.map(i => (
          <div key={i._id} className="col-md-4 mb-3">
            <div className="card p-3">
              <div style={{ width: '100%', height: 160, marginBottom: 8 }}>
                <img src={i.image || `https://source.unsplash.com/collection/888146/400x300?sig=${i._id}`} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              </div>
              <div style={{ fontWeight: 700 }}>{i.name}</div>
              <div className="text-muted">{i.category}</div>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success" onClick={() => addToCart(i, 1)}>Add to Cart</button>
                <button className="btn btn-outline-danger" onClick={() => remove(i._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
