import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Header.css'

export default function Header({ onSearchOpen, onMenuOpen }) {
  const { lang, setLang, toggleLanguage, t } = useLanguage()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef(null)
  const closeTimer = useRef(null)
  const location = useLocation()

  /* ---- Scroll state ---- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ---- Close dropdown on route change ---- */
  useEffect(() => {
    setActiveDropdown(null)
  }, [location])

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

  const openDropdown = useCallback((id) => {
    clearTimeout(closeTimer.current)
    setActiveDropdown(id)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 180)
  }, [])

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current)
  }, [])

  const localizedNav = [
    {
      label: t('nav.home'),
      hasDropdown: false,
      href: '/',
    },
    {
      label: t('nav.aboutUs'),
      hasDropdown: true,
      href: '/about',
      items: [
        { label: t('nav.aboutDiocese'), href: '/about#about-diocese' },
        { label: t('nav.founder'), href: '/about#founder' },
        { label: t('nav.visionMission'), href: '/about#vision-mission' },
        { label: t('nav.faithStatement'), href: '/about#faith-statement' },
        { label: t('nav.aboutBoard'), href: '/about#about-board' },
      ],
    },
    {
      label: t('nav.diocese'),
      hasDropdown: true,
      href: '/diocese',
      items: [
        { label: t('nav.tirupatturDiocese'), href: '/diocese#tirupattur' },
        { label: t('nav.chengalpattuDiocese'), href: '/diocese#chengalpattu' },
        { label: t('nav.villupuramDiocese'), href: '/diocese#villupuram' },
        { label: t('nav.maduraiDiocese'), href: '/diocese#madurai' },
        { label: t('nav.trichyDiocese'), href: '/diocese#trichy' },
        { label: t('nav.virudhunagarDiocese'), href: '/diocese#virudhunagar' },
        { label: t('nav.kanniyakumariDiocese'), href: '/diocese#kanniyakumari' },
      ],
    },
    {
      label: t('nav.activities'),
      hasDropdown: true,
      href: '/activities',
      items: [
        { label: t('nav.ordination'), href: '/activities#ordination' },
        { label: t('nav.wordSharing'), href: '/activities#wordsharingmeet' },
        { label: t('nav.zonalMeet'), href: '/activities#zonalmeet' },
        { label: t('nav.churchVisit'), href: '/activities#churchvisit' },
        { label: t('nav.childrenMinistry'), href: '/activities#childrenministry' },
        { label: t('nav.youthMinistry'), href: '/activities#youthministry' },
        { label: t('nav.outreach'), href: '/activities#outreach' },
      ],
    },
    {
      label: t('nav.partnership'),
      hasDropdown: true,
      href: '/partnership',
      items: [
        { label: t('nav.prayer'), href: '/partnership#prayer' },
        { label: t('nav.partnerTestimony'), href: '/partnership#partnertestimony' },
        { label: t('nav.contributions'), href: '/partnership#contributions' },
        { label: t('nav.donation'), href: '/partnership#donation' },
        { label: t('nav.opportunityToSow'), href: '/partnership#opportunitytosow' },
      ],
    },
    {
      label: t('nav.synod'),
      hasDropdown: true,
      href: '/synod',
      items: [
        { label: t('nav.aboutSynod'), href: '/synod#aboutsynod' },
        { label: t('nav.synodFunctions'), href: '/synod#synodfunctions' },
        { label: t('nav.synodPublications'), href: '/synod#synodpublications' },
        { label: t('nav.synodAcademicCouncil'), href: '/synod#synodacademiccouncil' },
        { label: t('nav.synodGeneralCouncil'), href: '/synod#synodgeneralcouncil' },
      ],
    },
    {
      label: t('nav.media'),
      hasDropdown: true,
      href: '/media',
      items: [
        { label: t('nav.magazines'), href: '/media#magazines' },
        { label: t('nav.audio'), href: '/media#audio' },
        { label: t('nav.video'), href: '/media#video' },
        { label: t('nav.literature'), href: '/media#literature' },
      ],
    },
    {
      label: t('nav.gallery'),
      hasDropdown: false,
      href: '/gallery',
    },
    {
      label: t('nav.contact'),
      hasDropdown: false,
      href: '/contact',
    },
  ]

  return (
    <header
      ref={headerRef}
      className={`site-header${isScrolled ? ' scrolled' : ''}`}
      role="banner"
    >
      <div className="header-inner container">

        {/* ---- Logo ---- */}
        <Link to="/" className="header-logo" aria-label="ACI Diocese — Home">
          <img
            src="/aci-logo.png"
            alt="ACI Diocese — Apostolic Council of India Diocese"
            className="logo-img"
            width="48"
            height="48"
          />
          <div className="logo-text">
            <span className="logo-name">{t('common.siteName')}</span>
            <span className="logo-tagline">{t('common.tagline')}</span>
          </div>
        </Link>

        {/* ---- Desktop Navigation ---- */}
        <nav className="header-nav" aria-label="Main navigation">
          <ul className="nav-list" role="list">
            {localizedNav.map((item, idx) => (
              <li
                key={idx}
                className={`nav-item${item.hasDropdown ? ' has-dropdown' : ''}${activeDropdown === idx ? ' active' : ''}`}
                onMouseEnter={() => item.hasDropdown && openDropdown(idx)}
                onMouseLeave={() => item.hasDropdown && scheduleClose()}
              >
                {item.hasDropdown ? (
                  <>
                    <Link
                      to={item.href}
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
                    </Link>

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
                            <Link
                              to={sub.href}
                              className="dropdown-link"
                              role="menuitem"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link to={item.href} className="nav-link t-nav">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- Right Controls: Language Switcher + Search + Mobile hamburger ---- */}
        <div className="header-controls">

          {/* Bilingual Language Switcher Pill */}
          <div className="lang-switcher-pill" role="group" aria-label="Language Selector">
            <button
              onClick={() => setLang('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <span className="lang-sep">|</span>
            <button
              onClick={() => setLang('ta')}
              className={`lang-btn ${lang === 'ta' ? 'active' : ''}`}
              aria-pressed={lang === 'ta'}
            >
              தமிழ்
            </button>
          </div>

          {/* Search Icon */}
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
