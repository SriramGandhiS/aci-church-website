import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { IdCardIcon, ArrowRightIcon, ShieldIcon } from '../Icons/SvgIcons'
import './DirectoryCta.css'

export default function DirectoryCta() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  return (
    <section className="dir-cta-section">
      <div className="container">
        <div className="dir-cta-inner">
          <div className="dir-cta-text">
            <span className="dir-cta-label">
              <ShieldIcon size={14} color="#ffffff" />
              {isTa ? 'அதிகாரப்பூர்வ பேராய பதிவேடு & அடையாள அட்டை' : 'Official Registered Ministerial Directory'}
            </span>
            <h2 className="dir-cta-title">
              {isTa ? '850+ பதிவுபெற்ற ஊழியர்கள் & மேய்ப்பர்கள் தேடல்' : 'Search 850+ Registered Pastors & Ordained Ministers'}
            </h2>
            <p className="dir-cta-desc">
              {isTa
                ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் பதிவுசெய்யப்பட்ட அனைத்து எபிஸ்கோபல் போதகர்கள், சுவிசேஷகர்கள் மற்றும் ஊழியர்களின் விவரங்களை தேடி அவர்களின் அதிகாரப்பூர்வ அடையாள அட்டையைக் காண்க.'
                : 'Verify episcopal ordination credentials, search registered ministers by TN number, name or district, and view official diocesan credential cards.'}
            </p>
          </div>

          <div className="dir-cta-action">
            <Link to="/directory" className="dir-cta-btn">
              <IdCardIcon size={18} color="#000000" />
              <span>{isTa ? 'ஊழியர் பதிவேட்டைத் திறக்குக' : 'Open Member Directory'}</span>
              <ArrowRightIcon size={14} color="#000000" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
