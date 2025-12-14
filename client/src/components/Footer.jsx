import React from 'react'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(90deg, rgba(255,204,229,0.08), rgba(255,240,245,0.06))', borderTop: '1px solid rgba(0,0,0,0.04)' }} className="py-3 mt-4">
      <div className="container d-flex justify-content-between align-items-center">
        <div style={{ color: '#6b2135', fontWeight: 700 }}>🎶 Sweet Symphony</div>
        <div style={{ color: '#6b2135' }} className="small">© {new Date().getFullYear()} Sweet Symphony. All Rights Reserved.</div>
      </div>
    </footer>
  )
}
