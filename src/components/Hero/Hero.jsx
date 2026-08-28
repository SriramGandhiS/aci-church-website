import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './Hero.css'

const BANNER_SLIDES = [
  {
    src: '/crowd.jpeg',
    alt: 'ACI Diocese Christian fellowship and worship gathering',
  },
  {
    src: '/banner-1.jpg',
    alt: 'ACI Diocese Christian worship gathering and congregation in prayer',
  },
  {
    src: '/banner-2.jpg',
    alt: 'The Most Rev. Archbishop delivering the Word of God at the pulpit',
  },
  {
    src: '/banner-3.jpg',
    alt: 'ACI Diocese Episcopal Ordination and consecrated bishops',
  },
]

export default function Hero() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const [currentSlide, setCurrentSlide] = useState(0)

  /* Automatically advance background banner slides every 3.5 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero" aria-label="Welcome to ACI Diocese">
      {/* Background Banner Slides moving one after another */}
      <div className="hero-bg">
        {BANNER_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide-item ${index === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="hero-img"
              fetchpriority={index === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="hero-content container">
        <div className="hero-body">
          <p className="hero-eyebrow">
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்'
              : 'Welcome to Apostolic Council of India Diocese'}
          </p>

          <h1 className="hero-headline t-hero">
            {isTa ? (
              <>
                மேய்ப்பர்களுக்கு<br />
                மேய்ச்சல்
              </>
            ) : (
              <>
                Shepherding<br />
                the Shepherds
              </>
            )}
          </h1>

          <p className="hero-subtagline">
            {isTa ? (
              <>
                <span>ஆயத்தப்படுத்துதல்</span>
                <span className="hero-subtagline-dot" aria-hidden="true">•</span>
                <span>பலப்படுத்துதல்</span>
                <span className="hero-subtagline-dot" aria-hidden="true">•</span>
                <span>ராஜ்யத்தை விரிவுபடுத்துதல்</span>
              </>
            ) : (
              <>
                <span>Equipping</span>
                <span className="hero-subtagline-dot" aria-hidden="true">•</span>
                <span>Empowering</span>
                <span className="hero-subtagline-dot" aria-hidden="true">•</span>
                <span>Expanding the Kingdom</span>
              </>
            )}
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="hero-indicators" aria-label="Banner slide indicators">
          {BANNER_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
