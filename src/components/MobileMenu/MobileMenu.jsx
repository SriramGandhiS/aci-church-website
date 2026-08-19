import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../data/navigation'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const [expandedIdx, setExpandedIdx] = useState(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setExpandedIdx(null)
  }, [isOpen])

  const toggleSub = (idx) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx))
  }

  return (
    <div
      className={`mobile-menu${isOpen ? ' open' : ''}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="mm-header">
        <Link to="/" className="mm-logo" onClick={onClose}>
          <img
            src="/aci-logo.png"
            alt="ACI Diocese"
            className="mm-logo-img"
            width="40"
            height="40"
          />
          <span className="mm-logo-name">ACI Diocese</span>
        </Link>
        <button
          className="mm-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <nav className="mm-nav" aria-label="Mobile navigation">
        <ul className="mm-list" role="list">
          {navItems.map((item, idx) => (
            <li key={idx} className="mm-item">
              {item.hasDropdown ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Link
                      to={item.href}
                      className="mm-link"
                      onClick={onClose}
                      style={{ flex: 1 }}
                    >
                      {item.label}
                    </Link>
                    <button
                      className="mm-link mm-toggle"
                      onClick={() => toggleSub(idx)}
                      aria-expanded={expandedIdx === idx}
                      style={{ width: 'auto', padding: '18px 20px' }}
                    >
                      <svg
                        className={`mm-chevron${expandedIdx === idx ? ' rotated' : ''}`}
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  <ul
                    id={`mm-sub-${idx}`}
                    className={`mm-sub${expandedIdx === idx ? ' open' : ''}`}
                    role="list"
                  >
                    {item.items.map((sub, si) => (
                      <li key={si}>
                        <Link
                          to={sub.href}
                          className="mm-sub-link"
                          onClick={onClose}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link to={item.href} className="mm-link" onClick={onClose}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mm-bottom">
        <Link to="/partnership#sow" className="btn btn-light mm-give" onClick={onClose}>
          Sow Your Seed <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  )
}
