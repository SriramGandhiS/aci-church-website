import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './HeroActionBox.css'

export default function HeroActionBox() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  return (
    <section className="hero-action-section" aria-label="Quick Action Buttons">
      <div className="container">
        <div className="hero-action-row">
          {/* 1. About Us */}
          <Link to="/about" className="hero-action-btn btn-action-about">
            <span>{isTa ? 'பேராயம் பற்றி' : 'About Us'}</span>
            <span className="action-arrow">→</span>
          </Link>

          {/* 2. Get Involved */}
          <Link to="/activities" className="hero-action-btn btn-action-involved">
            <span>{isTa ? 'செயல்பாடுகள் (Get Involved)' : 'Get Involved'}</span>
            <span className="action-arrow">→</span>
          </Link>

          {/* 3. Sow Button */}
          <Link to="/partnership#opportunitytosow" className="hero-action-btn btn-action-sow">
            <span>{isTa ? 'விதைத்திடுங்கள் (Sow)' : 'Partner in Sowing'}</span>
            <span className="action-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
