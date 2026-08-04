import { useEffect, useRef } from 'react'
import './Hero.css'

/*
 * HERO IMAGE — Tamil Nadu / South Indian Christian worship gathering.
 * Replace /img-hero.jpg with the actual ACI Diocese photograph
 * when official media is provided.
 */
export default function Hero() {
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
            Welcome to Apostolic Council of India Diocese
          </p>

          <h1 className="hero-headline t-hero">
            One Body.<br />
            One Faith.<br />
            One Mission.
          </h1>

          <div className="hero-buttons">
            <a href="#about" className="btn btn-light">
              About ACI <span className="arrow">→</span>
            </a>
            <a href="#get-involved" className="btn btn-outline-white">
              Get Involved <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
