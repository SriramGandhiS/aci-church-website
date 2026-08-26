import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { ShieldIcon, ArrowRightIcon } from '../Icons/SvgIcons'
import './GetInvolvedCta.css'

export default function GetInvolvedCta() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  return (
    <section className="gi-cta-section">
      <div className="container">
        <div className="gi-cta-box">
          <div className="gi-cta-content">
            <span className="gi-cta-badge">
              <ShieldIcon size={12} color="#c8a96e" />
              <span>{isTa ? 'பேராய உறுப்புரிமை & பிரதிஷ்டை' : 'MINISTERIAL AFFILIATION & ORDINATION'}</span>
            </span>

            <h2 className="gi-cta-heading">
              {isTa
                ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையுங்கள்'
                : 'Get Involved & Apply for Diocesan Membership'}
            </h2>

            <p className="gi-cta-para">
              {isTa
                ? 'சுயாதீன போதகர்கள் மற்றும் இறை ஊழியர்களுக்கு ஆவிக்குரிய வழிகாட்டுதல், வேத உபதேசம் மற்றும் சட்டப்பூர்வ அங்கீகாரம் வழங்கும் அப்போஸ்தல இயக்கம். ஆன்லைன் விண்ணப்பத்தை இப்போதே தொடங்கவும்.'
                : 'Join a Christ-centered apostolic movement committed to shepherding the shepherd, biblical ordination, fivefold ministry fellowship, and statutory recognition across India.'}
            </p>
          </div>

          <div className="gi-cta-btn-wrap">
            <Link to="/get-involved" className="gi-cta-action-btn">
              <span>{isTa ? 'இணையுங்கள் (Get Involved)' : 'Get Involved'}</span>
              <ArrowRightIcon size={14} color="#000000" />
            </Link>
            <Link to="/get-involved/application" className="gi-cta-sub-link">
              <span>{isTa ? 'நேரடி விண்ணப்பப் படிவம்' : 'Go directly to Application'}</span>
              <ArrowRightIcon size={11} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
