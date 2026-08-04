import { useEffect, useRef } from 'react'
import './SearchOverlay.css'

export default function SearchOverlay({ isOpen, onClose }) {
  const inputRef = useRef(null)

  /* Auto-focus input when opened */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen])

  /* ESC closes overlay */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  /* Prevent body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search ACI Diocese"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="search-overlay-inner">

        {/* Close */}
        <button
          className="search-close"
          onClick={onClose}
          aria-label="Close search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Search input */}
        <div className="search-field-wrap">
          <label htmlFor="site-search" className="sr-only">Search</label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            placeholder="Search messages, events, ministries…"
            className="search-input"
            autoComplete="off"
          />
          <button className="search-submit" aria-label="Submit search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <p className="search-hint t-body">
          Press <kbd>Enter</kbd> to search · <kbd>Esc</kbd> to close
        </p>

      </div>
    </div>
  )
}
