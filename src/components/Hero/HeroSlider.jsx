import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './HeroSlider.css'

const SLIDE_IMAGES = [
  'http://acidiocese.org/gallery/23rd%20Ordination%2010.04.2024/4498769c2b5924c919c9336e04979875.jpg',
  'http://acidiocese.org/gallery/Madurai%20Zonal%20Office%20Dedication%20Service/7cc60a065180716a1dd0a3fe4db93be3.jpg',
  'http://acidiocese.org/gallery/YOUTH%20DAY%202022/ecb0b4a539fb2fa8e455481c94fc593c.jpg',
  'http://acidiocese.org/gallery/5th%20Church%20Visit/c50ad7cfc01b9dfaf710f5bf102b1851.jpg',
  'http://acidiocese.org/gallery/Church%20Dedication%20/f79744d5293e7c9c16935e976bffa844.jpg',
]

export default function HeroSlider() {
  const { lang, t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = SLIDE_IMAGES.length
  const timerRef = useRef(null)

  const slidesData = t('hero.slides') || []

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    if (isPaused) return
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount)
    }, 5500)
    return () => clearInterval(timerRef.current)
  }, [isPaused, slideCount])

  const goToSlide = (idx) => {
    setCurrentSlide(idx)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount)
  }

  const activeSlide = slidesData[currentSlide] || slidesData[0] || {}

  return (
    <section
      className="hero-slider-section"
      aria-label="Welcome to ACI Diocese Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Crossfade & Ken Burns Zoom */}
      <div className="hero-slides-bg">
        {SLIDE_IMAGES.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`hero-slide-layer ${idx === currentSlide ? 'active' : ''}`}
          >
            <img
              src={imgUrl}
              alt={`ACI Diocese Slide ${idx + 1}`}
              className="hero-slide-img"
              loading={idx === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.target.src = '/img-hero.jpg'
              }}
            />
            <div className="hero-slide-scrim" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="hero-slider-content container">
        <div className="hero-slider-body" key={currentSlide}>
          <div className="hero-eyebrow-pill">
            <span className="hero-badge-dot" />
            <p className="t-label hero-eyebrow-text">
              {activeSlide.eyebrow}
            </p>
          </div>

          <h1 className="hero-main-title">
            {activeSlide.title}
          </h1>

          <p className="hero-subtitle">
            {activeSlide.subtitle}
          </p>

          <div className="hero-actions">
            {activeSlide.linkPrimary && (
              <Link to={activeSlide.linkPrimary} className="btn hero-btn-gold">
                {activeSlide.btnPrimary} <span className="arrow">→</span>
              </Link>
            )}
            {activeSlide.linkSecondary && (
              <Link to={activeSlide.linkSecondary} className="btn hero-btn-outline">
                {activeSlide.btnSecondary} <span className="arrow">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Carousel Bottom Controls */}
        <div className="hero-controls-bar">
          {/* Arrow Buttons */}
          <div className="hero-arrow-group">
            <button
              onClick={prevSlide}
              className="hero-nav-arrow"
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              className="hero-nav-arrow"
              aria-label="Next Slide"
            >
              ›
            </button>
          </div>

          {/* Slide Indicator Dots */}
          <div className="hero-dots-group">
            {SLIDE_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span className="hero-dot-progress" />
              </button>
            ))}
          </div>

          {/* Slide Counter */}
          <div className="hero-counter">
            <span className="hero-current-num">0{currentSlide + 1}</span>
            <span className="hero-counter-sep">/</span>
            <span className="hero-total-num">0{slideCount}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
