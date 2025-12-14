import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { const raw = localStorage.getItem('wishlist'); return raw ? JSON.parse(raw) : [] } catch (e) { return [] }
  })

  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(items)) }, [items])

  function toggle(product) {
    setItems(prev => {
      const exists = prev.some(i => i._id === product._id)
      if (exists) return prev.filter(i => i._id !== product._id)
      return [...prev, product]
    })
  }

  function remove(productId) {
    setItems(prev => prev.filter(i => i._id !== productId))
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() { return useContext(WishlistContext) }
