import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const { lang, setLang, t } = useLanguage()
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const location = useLocation()
  const prevPathnameRef = useRef(location.pathname)

  // Close ONLY when location.pathname actually changes
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname
      onClose?.()
    }
  }, [location.pathname, onClose])

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Localized Navigation Items for Mobile Drawer
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
      label: t('nav.directory'),
      hasDropdown: false,
      href: '/directory',
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
            onError={(e) => { e.target.src = '/aci-logo.jpg' }}
          />
          <span className="mm-logo-name">{t('common.siteName')}</span>
        </Link>

        {/* Mobile Language Switcher */}
        <div className="lang-switcher-pill" style={{ marginLeft: 'auto', marginRight: '12px' }}>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <span className="lang-sep">|</span>
          <button
            type="button"
            onClick={() => setLang('ta')}
            className={`lang-btn ${lang === 'ta' ? 'active' : ''}`}
          >
            தமிழ்
          </button>
        </div>

        <button
          type="button"
          className="mm-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <nav className="mm-nav" aria-label="Mobile navigation">
        <ul className="mm-list" role="list">
          {localizedNav.map((item, idx) => (
            <li key={idx} className="mm-item">
              {item.hasDropdown ? (
                <div>
                  <div className="mm-item-row">
                    <Link
                      to={item.href}
                      className="mm-link"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className={`mm-expand-btn${openSubmenu === idx ? ' open' : ''}`}
                      aria-expanded={openSubmenu === idx}
                      aria-label={`Toggle ${item.label} sub-links`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenSubmenu(openSubmenu === idx ? null : idx)
                      }}
                    >
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
                        <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  {openSubmenu === idx && (
                    <ul className="mm-sublist" role="list">
                      {item.items.map((sub, si) => (
                        <li key={si} className="mm-subitem">
                          <Link
                            to={sub.href}
                            className="mm-sublink"
                            onClick={onClose}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className="mm-link"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mm-footer">
        <div className="mm-contact">
          <p className="mm-contact-label">{t('common.officialDiocese')}</p>
          <p className="mm-contact-text">Batlagundu & Dindigul, Tamil Nadu, India</p>
          <p className="mm-contact-text">Email: rev.johnsondurai@gmail.com</p>
          <p className="mm-contact-text">Mobile: +91 94864 85810</p>
        </div>
      </div>
    </div>
  )
}
