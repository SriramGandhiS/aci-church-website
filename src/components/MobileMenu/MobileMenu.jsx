import { useState, useEffect } from 'react'
import { navItems } from '../../data/navigation'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const [expandedIdx, setExpandedIdx] = useState(null)

  /* ESC to close */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Reset expanded when menu closes */
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
      {/* Header row */}
      <div className="mm-header">
        <a href="/" className="mm-logo" onClick={onClose}>
          <img
            src="/aci-logo.png"
            alt="ACI Diocese"
            className="mm-logo-img"
            width="40"
            height="40"
          />
          <span className="mm-logo-name">ACI Diocese</span>
        </a>
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

      {/* Nav links */}
      <nav className="mm-nav" aria-label="Mobile navigation">
        <ul className="mm-list" role="list">
          {navItems.map((item, idx) => (
            <li key={idx} className="mm-item">
              {item.hasDropdown ? (
                <>
                  <button
                    className="mm-link mm-toggle"
                    onClick={() => toggleSub(idx)}
                    aria-expanded={expandedIdx === idx}
                    aria-controls={`mm-sub-${idx}`}
                  >
                    <span>{item.label}</span>
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

                  <ul
                    id={`mm-sub-${idx}`}
                    className={`mm-sub${expandedIdx === idx ? ' open' : ''}`}
                    role="list"
                  >
                    {item.items.map((sub, si) => (
                      <li key={si}>
                        <a
                          href={sub.href}
                          className="mm-sub-link"
                          onClick={onClose}
                        >
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a href={item.href} className="mm-link" onClick={onClose}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom CTA */}
      <div className="mm-bottom">
        <a href="#give" className="btn btn-light mm-give" onClick={onClose}>
          Give <span className="arrow">→</span>
        </a>
      </div>
    </div>
  )
}
