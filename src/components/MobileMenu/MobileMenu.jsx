import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose }) {
  const { lang, setLang, t } = useLanguage()
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
          <span className="mm-logo-name">{t('common.siteName')}</span>
        </Link>

        {/* Mobile Language Switcher */}
        <div className="lang-switcher-pill" style={{ marginLeft: 'auto', marginRight: '12px' }}>
          <button
            onClick={() => setLang('en')}
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <span className="lang-sep">|</span>
          <button
            onClick={() => setLang('ta')}
            className={`lang-btn ${lang === 'ta' ? 'active' : ''}`}
          >
            தமிழ்
          </button>
        </div>

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
          {localizedNav.map((item, idx) => (
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
        <Link to="/partnership#opportunitytosow" className="btn btn-light mm-give" onClick={onClose}>
          {t('common.sowSeed')} <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  )
}
