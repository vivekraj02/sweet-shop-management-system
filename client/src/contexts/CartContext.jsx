import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  function addToCart(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) return prev.map(i => i._id === product._id ? { ...i, quantity: Math.min(i.quantity + qty, product.quantity) } : i)
      return [...prev, { ...product, quantity: Math.min(qty, product.quantity) }]
    })
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i._id !== productId))
  }

  function updateQuantity(productId, quantity) {
    setItems(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i))
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
