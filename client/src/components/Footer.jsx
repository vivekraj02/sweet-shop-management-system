import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, rgba(255,204,229,0.1), rgba(255,240,245,0.08))', borderTop: '2px solid rgba(255,136,184,0.2)', marginTop: 'auto' }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-3">
              <h5 style={{ color: '#6b2135', fontWeight: 700, marginBottom: '1rem' }}>
                🎶 Sweet Symphony
              </h5>
              <p style={{ color: '#6b2135', lineHeight: 1.6, marginBottom: '1rem' }}>
                Indulge in the finest selection of traditional Indian sweets. Quality ingredients,
                authentic flavors, and delivered with love to your doorstep.
              </p>
              <div className="d-flex gap-3">
                <a href="#" style={{ color: '#fb7185', fontSize: '1.2rem', textDecoration: 'none' }}>📘</a>
                <a href="#" style={{ color: '#fb7185', fontSize: '1.2rem', textDecoration: 'none' }}>📷</a>
                <a href="#" style={{ color: '#fb7185', fontSize: '1.2rem', textDecoration: 'none' }}>🐦</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ color: '#6b2135', fontWeight: 600, marginBottom: '1rem' }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" style={{ color: '#6b2135', textDecoration: 'none', fontSize: '0.9rem' }}>
                  🏠 Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" style={{ color: '#6b2135', textDecoration: 'none', fontSize: '0.9rem' }}>
                  🛒 Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/wishlist" style={{ color: '#6b2135', textDecoration: 'none', fontSize: '0.9rem' }}>
                  ❤️ Wishlist
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/login" style={{ color: '#6b2135', textDecoration: 'none', fontSize: '0.9rem' }}>
                  🔐 Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ color: '#6b2135', fontWeight: 600, marginBottom: '1rem' }}>Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2" style={{ color: '#6b2135', fontSize: '0.9rem' }}>🍬 Traditional</li>
              <li className="mb-2" style={{ color: '#6b2135', fontSize: '0.9rem' }}>🥥 Coconut</li>
              <li className="mb-2" style={{ color: '#6b2135', fontSize: '0.9rem' }}>🫘 Besan</li>
              <li className="mb-2" style={{ color: '#6b2135', fontSize: '0.9rem' }}>🍯 Honey</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h6 style={{ color: '#6b2135', fontWeight: 600, marginBottom: '1rem' }}>Contact Us</h6>
            <div className="d-flex flex-column gap-2">
              <div style={{ color: '#6b2135', fontSize: '0.9rem' }}>
                📍 123 Sweet Street, Mumbai, India
              </div>
              <div style={{ color: '#6b2135', fontSize: '0.9rem' }}>
                📞 +91 12345 67890
              </div>
              <div style={{ color: '#6b2135', fontSize: '0.9rem' }}>
                ✉️ hello@sweetsymphony.com
              </div>
              <div style={{ color: '#6b2135', fontSize: '0.9rem' }}>
                🕒 Mon-Sun: 9AM - 9PM IST
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr style={{ borderColor: 'rgba(255,136,184,0.2)', margin: '2rem 0' }} />
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ color: '#6b2135', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Sweet Symphony. All Rights Reserved.
          </div>
          <div className="d-flex gap-4" style={{ fontSize: '0.85rem' }}>
            <a href="#" style={{ color: '#6b2135', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#6b2135', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#6b2135', textDecoration: 'none' }}>Shipping Info</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
