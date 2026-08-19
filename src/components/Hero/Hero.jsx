import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Hero.css'

export default function Hero() {
  const { lang, t } = useLanguage()
  const isTa = lang === 'ta'
  const parallaxRef = useRef(null)

  /* Subtle image parallax on scroll */
  useEffect(() => {
    const el = parallaxRef.current
    if (!el) return
    const handleScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.22}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="hero" aria-label="Welcome to ACI Diocese">
      {/* Background image */}
      <div className="hero-bg">
        <img
          ref={parallaxRef}
          src="/img-hero.jpg"
          alt="ACI Diocese Tamil Nadu Christian worship gathering"
          className="hero-img"
          fetchpriority="high"
        />
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="hero-content container">
        <div className="hero-body">
          <p className="hero-eyebrow t-label">
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்'
              : 'Welcome to Apostolic Council of India Diocese'}
          </p>

          <h1 className="hero-headline t-hero">
            {isTa ? (
              <>
                ஒரே சரீரம்.<br />
                ஒரே விசுவாசம்.<br />
                ஒரே பணி.
              </>
            ) : (
              <>
                One Body.<br />
                One Faith.<br />
                One Mission.
              </>
            )}
          </h1>

          <div className="hero-buttons">
            <Link to="/about" className="btn btn-light">
              {isTa ? 'பேராயம் பற்றி' : 'About ACI'} <span className="arrow">→</span>
            </Link>
            <Link to="/activities" className="btn btn-outline-white">
              {isTa ? 'செயல்பாடுகள்' : 'Get Involved'} <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
