import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  ShieldIcon,
  CrossIcon,
  BookIcon,
  UserCheckIcon,
  DocumentIcon,
  CheckIcon,
  ArrowRightIcon,
  ChurchIcon
} from '../components/Icons/SvgIcons'
import { REQUIRED_ENCLOSURES } from '../data/applicationDefaults'
import './GetInvolvedPage.css'

export default function GetInvolvedPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="gi-page">

      {/* Hero Header */}
      <section className="gi-hero">
        <div className="gi-hero-inner">
          <div className="gi-badge">
            <ShieldIcon size={13} color="#c8a96e" />
            <span>{isTa ? 'அதிகாரப்பூர்வ பேராய உறுப்புரிமை' : 'Official Ministerial Affiliation & Ordination'}</span>
          </div>

          <h1 className="gi-title">
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையுங்கள்' : 'Get Involved with ACI Diocese'}
          </h1>

          <p className="gi-subtitle">
            {isTa
              ? 'சுயாதீன போதகர்கள், சுவிசேஷகர்கள் மற்றும் இறை ஊழியர்களுக்கு ஆவிக்குரிய தங்குமிடம், சட்டப்பூர்வ அங்கீகாரம் மற்றும் ஐவகை ஊழிய ஐக்கியத்தை வழங்கி மேய்ப்பர்களை தாங்கி நடத்தும் அப்போஸ்தல இயக்கம்.'
              : 'A dedicated spiritual shelter, legal accreditation, and apostolic fivefold fellowship designed to strengthen and shepherd independent pastors, evangelists, and ministers of God across India.'}
          </p>

          <div className="gi-hero-actions">
            <Link to="/get-involved/application" className="gi-btn-primary">
              <span>{isTa ? 'விண்ணப்பத்தைத் தொடங்குங்கள்' : 'Continue to Application'}</span>
              <ArrowRightIcon size={14} color="#000000" />
            </Link>

            <Link to="/about#faith-statement" className="gi-btn-secondary">
              <span>{isTa ? 'விசுவாச அறிக்கை காண்க' : 'Statement of Faith'}</span>
              <ArrowRightIcon size={14} color="#ffffff" />
            </Link>
          </div>
        </div>
      </section>

      <div className="gi-container">

        {/* Core Pillars Section */}
        <div className="gi-section-header">
          <p className="gi-eyebrow">{isTa ? 'பேராயத்தின் முக்கிய தூண்கள்' : 'Why Get Involved'}</p>
          <h2 className="gi-section-title">
            {isTa ? 'இறை ஊழியர்களுக்கான ஆவிக்குரிய & சட்டப்பூர்வ நன்மைகள்' : 'Spiritual Fellowship, Ordination & Ministerial Accreditation'}
          </h2>
          <p className="gi-section-desc">
            {isTa
              ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா (பதிவு எண்: 62/B.k.4/2013) தங்களது ஊழியப் பயணத்தை தாங்கி வழிநடத்த பல்வேறு தளங்களில் உதவுகிறது.'
              : 'Registered under Trust Act No. 62/B.k.4/2013, ACI Diocese provides dedicated spiritual shepherding, doctrinal foundation, and legal standing under Indian law.'}
          </p>
        </div>

        <div className="gi-pillars-grid">
          <div className="gi-pillar-card">
            <div className="gi-pillar-icon">
              <CrossIcon size={20} color="#c8a96e" />
            </div>
            <h3 className="gi-pillar-title">
              {isTa ? 'எபிஸ்கோபல் பிரதிஷ்டை' : 'Episcopal Ordination'}
            </h3>
            <p className="gi-pillar-text">
              {isTa
                ? 'ஐந்து ஆண்டுகளுக்கும் மேலாக இறைப் பணியில் உண்மையுடன் உழைத்த ஊழியர்களுக்கு வேத மற்றும் சட்டப்பூர்வ எபிஸ்கோபல் பிரதிஷ்டை வழங்கப்படுகிறது.'
                : 'Biblical, formal ordination for ministers with 5+ years of active field experience, conducted in the presence of the Episcopal Archbishop.'}
            </p>
          </div>

          <div className="gi-pillar-card">
            <div className="gi-pillar-icon">
              <ChurchIcon size={20} color="#c8a96e" />
            </div>
            <h3 className="gi-pillar-title">
              {isTa ? 'சபை சந்திப்பு & ஐக்கியம்' : 'Pastoral Fellowship & Visits'}
            </h3>
            <p className="gi-pillar-text">
              {isTa
                ? 'பேராய அறங்காவலர்கள் மற்றும் மேற்பார்வையாளர்களின் நேரடி சபை சந்திப்புகள், மண்டல வார்த்தைப் பகிர்வு கூட்டங்கள் மூலம் மேய்ப்பர்கள் பலப்படுத்தப்படுகின்றனர்.'
                : 'Regular Word Sharing meets, Zonal gatherings, and pastoral visits by diocesan trustees to encourage, teach, and pray with local congregations.'}
            </p>
          </div>

          <div className="gi-pillar-card">
            <div className="gi-pillar-icon">
              <ShieldIcon size={20} color="#c8a96e" />
            </div>
            <h3 className="gi-pillar-title">
              {isTa ? 'சட்டப்பூர்வ அங்கீகாரம்' : 'Statutory & Legal Accreditation'}
            </h3>
            <p className="gi-pillar-text">
              {isTa
                ? 'இந்திய சட்ட விதிகளின்படி கிறிஸ்தவ மத உரிமைகளை நிலைநாட்டவும், எபிஸ்கோபல் திருமணங்களை பதிவு செய்யவும் சட்டப்பூர்வ அதிகாரம்.'
                : 'Official standing under the law of the land to exercise Christian pastoral rights, legal identity, and episcopal marriage solemnization authority.'}
            </p>
          </div>

          <div className="gi-pillar-card">
            <div className="gi-pillar-icon">
              <BookIcon size={20} color="#c8a96e" />
            </div>
            <h3 className="gi-pillar-title">
              {isTa ? 'ஊழியப் பயிற்சிகள் & VBS' : 'Ministry & Leadership Training'}
            </h3>
            <p className="gi-pillar-text">
              {isTa
                ? 'சிறுவர் ஊழிய ஆசிரியர்கள் பயிற்சி, VBS இயக்குநர்கள் பயிற்சி மற்றும் வாலிபர் தலைமைத்துவ ஆலோசனைகள் தொடர்ந்து வழங்கப்படுகிறது.'
                : 'Sunday school teacher certification, VBS directors workshops, and youth leadership development programs to equip your local church wings.'}
            </p>
          </div>
        </div>

        {/* Interactive Visual Application Journey */}
        <div className="gi-process-wrap">
          <div className="gi-section-header" style={{ marginBottom: '24px' }}>
            <p className="gi-eyebrow">{isTa ? 'விண்ணப்ப செயல்முறை' : 'Visual Application Journey'}</p>
            <h2 className="gi-section-title">
              {isTa ? 'உறுப்பினராவதற்கான 4 எளிய படிகள்' : 'Step-by-Step Pathway to Involvement'}
            </h2>
            <p className="gi-section-desc">
              {isTa
                ? 'எங்கள் டிஜிட்டல் விண்ணப்ப முறையானது படிவத்தை நிரப்பவும், நிகழ்நேர முன்னோட்டத்தைக் காணவும் எளிதாக்கப்பட்டுள்ளது.'
                : 'A transparent, guided digital application designed to help you prepare information and complete your submission smoothly.'}
            </p>
          </div>

          <div className="gi-process-steps">
            <div className="gi-step-card">
              <div className="gi-step-num">01</div>
              <h4 className="gi-step-heading">{isTa ? 'பேராயத்தைப் பற்றி அறிதல்' : 'Learn About ACI'}</h4>
              <p className="gi-step-text">
                {isTa
                  ? 'பேராயத்தின் 15 விசுவாசக் கோட்பாடுகள், அப்போஸ்தல தரிசனம் மற்றும் வழிகாட்டுதல்களைப் படித்து அறிந்துகொள்ளுங்கள்.'
                  : 'Review our 15 foundational Articles of Faith, episcopal structure, and vision of Shepherding the Shepherd.'}
              </p>
            </div>

            <div className="gi-step-card">
              <div className="gi-step-num">02</div>
              <h4 className="gi-step-heading">{isTa ? 'ஆவணங்களைத் தயார் செய்தல்' : 'Prepare Documents'}</h4>
              <p className="gi-step-text">
                {isTa
                  ? 'அடையாள அட்டை, முகவரிச் சான்று, சபை புகைப்படம் மற்றும் ஊழிய சுருக்கக் குறிப்பை கையில் தயாராக வைத்துக் கொள்ளுங்கள்.'
                  : 'Keep your identity proof, address proof, passport photo, ministry statement, and church photos ready.'}
              </p>
            </div>

            <div className="gi-step-card">
              <div className="gi-step-num">03</div>
              <h4 className="gi-step-heading">{isTa ? 'டிஜிட்டல் படிவம் நிரப்புதல்' : 'Digital Application'}</h4>
              <p className="gi-step-text">
                {isTa
                  ? 'சுய விவரங்கள், ஆவிக்குரிய மைல்கற்கள், கல்வித் தகுதி மற்றும் குடும்ப விவரங்களை நேரடி முன்னோட்டத்துடன் நிரப்புங்கள்.'
                  : 'Fill out personal details, spiritual milestones, qualifications, and family details with live ID preview.'}
              </p>
            </div>

            <div className="gi-step-card">
              <div className="gi-step-num">04</div>
              <h4 className="gi-step-heading">{isTa ? 'சரிபார்த்தல் & சமர்ப்பித்தல்' : 'Review & Verification'}</h4>
              <p className="gi-step-text">
                {isTa
                  ? 'விவரங்களை முழுமையாக சரிபார்த்து, உறுதிமொழி ஏற்று விண்ணப்பத்தை தயார் செய்யுங்கள்.'
                  : 'Review the complete structured application dossier and sign the digital declaration for diocesan review.'}
              </p>
            </div>
          </div>
        </div>

        {/* Required Documents Preparation Checklist */}
        <div className="gi-checklist-wrap">
          <div className="gi-section-header">
            <p className="gi-eyebrow">{isTa ? 'தேவைப்படும் இணைப்புகள்' : 'Document Preparation Checklist'}</p>
            <h2 className="gi-section-title">
              {isTa ? 'விண்ணப்பிக்க தேவையான ஆவணங்கள்' : 'What to Have Ready Before You Begin'}
            </h2>
            <p className="gi-section-desc">
              {isTa
                ? 'அதிகாரப்பூர்வ பேராய விண்ணப்ப படிவத்தில் கேட்கப்பட்டுள்ள 8 முக்கிய ஆவணங்களின் பட்டியல் கீழே கொடுக்கப்பட்டுள்ளது.'
                : 'As specified on Page 4 of the official ACI Diocese membership application form, prepare these enclosures for your file.'}
            </p>
          </div>

          <div className="gi-checklist-grid">
            {REQUIRED_ENCLOSURES.map((item) => (
              <div key={item.id} className="gi-checklist-item">
                <div className="gi-check-icon-wrap">
                  <CheckIcon size={14} color="#c8a96e" />
                </div>
                <div>
                  <h4 className="gi-item-title">{isTa ? item.titleTa : item.titleEn}</h4>
                  <p className="gi-item-desc">{isTa ? item.descTa : item.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="gi-cta-banner">
          <p className="gi-eyebrow">{isTa ? 'ஆன்லைன் விண்ணப்பம்' : 'Ready to Begin?'}</p>
          <h2 className="gi-cta-title">
            {isTa ? 'பேராய உறுப்பினர் விண்ணப்பப் படிவத்தைத் தொடங்குங்கள்' : 'Start Your Diocesan Membership Application'}
          </h2>
          <p className="gi-cta-desc">
            {isTa
              ? '8-படி வழிகாட்டப்பட்ட டிஜிட்டல் படிவம் உங்கள் தகவல்களை நிகழ்நேரத்தில் அட்டையாக வடிவமைக்கும். எப்போது வேண்டுமானாலும் முந்தைய படிக்குச் செல்லலாம்.'
              : 'Our 8-step guided digital application auto-updates your live membership preview in real-time. You can navigate back and forth at any time.'}
          </p>

          <Link to="/get-involved/application" className="gi-btn-primary">
            <span>{isTa ? 'விண்ணப்பத்தைத் தொடங்குங்கள்' : 'Continue to Application'}</span>
            <ArrowRightIcon size={14} color="#000000" />
          </Link>

          <p className="gi-cta-hint">
            {isTa ? '⏱️ சுமார் 10–15 நிமிடங்கள் எடுக்கும் • உங்கள் உலாவியில் தானாக சேமிக்கப்படுகிறது' : '⏱️ Estimated time: 10–15 mins • Live interactive preview enabled'}
          </p>
        </div>

      </div>
    </div>
  )
}
