import { useState, useEffect, useRef, useCallback } from 'react'
import { navItems } from '../../data/navigation'
import './Header.css'

export default function Header({ onSearchOpen, onMenuOpen }) {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isScrolled, setIsScrolled]       = useState(false)
  const headerRef = useRef(null)
  const closeTimer = useRef(null)

  /* ---- Scroll state ---- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ---- Click outside to close ---- */
  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ---- ESC to close ---- */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setActiveDropdown(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const openDropdown  = useCallback((id) => {
    clearTimeout(closeTimer.current)
    setActiveDropdown(id)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 180)
  }, [])

  const cancelClose   = useCallback(() => {
    clearTimeout(closeTimer.current)
  }, [])

  return (
    <header
      ref={headerRef}
      className={`site-header${isScrolled ? ' scrolled' : ''}`}
      role="banner"
    >
      <div className="header-inner container">

        {/* ---- Logo ---- */}
        <a href="/" className="header-logo" aria-label="ACI Diocese — Home">
          <img
            src="/aci-logo.png"
            alt="ACI Diocese — Apostolic Council of India Diocese"
            className="logo-img"
            width="48"
            height="48"
          />
          <div className="logo-text">
            <span className="logo-name">ACI Diocese</span>
            <span className="logo-tagline">Shepherding the Shepherds</span>
          </div>
        </a>

        {/* ---- Desktop Navigation ---- */}
        <nav className="header-nav" aria-label="Main navigation">
          <ul className="nav-list" role="list">
            {navItems.map((item, idx) => (
              <li
                key={idx}
                className={`nav-item${item.hasDropdown ? ' has-dropdown' : ''}${activeDropdown === idx ? ' active' : ''}`}
                onMouseEnter={() => item.hasDropdown && openDropdown(idx)}
                onMouseLeave={() => item.hasDropdown && scheduleClose()}
              >
                {item.hasDropdown ? (
                  <>
                    <button
                      className="nav-link t-nav"
                      aria-expanded={activeDropdown === idx}
                      aria-haspopup="true"
                      aria-controls={`dropdown-${idx}`}
                      onClick={() =>
                        setActiveDropdown(activeDropdown === idx ? null : idx)
                      }
                    >
                      {item.label}
                      <svg
                        className="chevron"
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 1l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Dropdown panel */}
                    <div
                      id={`dropdown-${idx}`}
                      className={`dropdown-panel${activeDropdown === idx ? ' visible' : ''}`}
                      role="menu"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      <ul role="list">
                        {item.items.map((sub, si) => (
                          <li key={si} role="none">
                            <a
                              href={sub.href}
                              className="dropdown-link"
                              role="menuitem"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <a href={item.href} className="nav-link t-nav">
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- Right Controls ---- */}
        <div className="header-controls">
          <button
            className="icon-btn search-btn"
            aria-label="Open search"
            onClick={onSearchOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            className="icon-btn hamburger"
            aria-label="Open navigation menu"
            aria-expanded={false}
            onClick={onMenuOpen}
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>

      </div>
    </header>
  )
}
