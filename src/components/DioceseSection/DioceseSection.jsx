import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { LocationIcon, ArrowRightIcon } from '../Icons/SvgIcons'
import './DioceseSection.css'

const regionalDioceses = [
  {
    id: 'tirupattur',
    num: '01',
    nameEn: 'ACI Tirupattur Diocese',
    nameTa: 'ஏசிஐ திருப்பத்தூர் பேராயம்',
    zoneEn: 'Tirupattur Zone',
    zoneTa: 'திருப்பத்தூர் மண்டலம்',
    bishopNameEn: 'Rt. Rev. B. Simson',
    bishopNameTa: 'Rt. Rev. B. சிம்சன்',
    image: '/dioceses/bishop-1.jpg',
    descEn: 'Empowering pastors, church planting initiatives, and active youth evangelism across northern mission fields.',
    descTa: 'வட தமிழகத்தில் போதகர்கள் ஐக்கியம், சபை நிறுவுதல் மற்றும் வாலிபர் எழுப்புதல் பணிகளை வழிநடத்துகிறது.'
  },
  {
    id: 'chengalpattu',
    num: '02',
    nameEn: 'ACI Chengalpattu Diocese',
    nameTa: 'ஏசிஐ செங்கல்பட்டு பேராயம்',
    zoneEn: 'Chengalpattu & Kanchi Zone',
    zoneTa: 'செங்கல்பட்டு & காஞ்சி மண்டலம்',
    bishopNameEn: 'Rt. Rev. S. Anand',
    bishopNameTa: 'Rt. Rev. S. ஆனந்த்',
    image: '/dioceses/bishop-2.jpg',
    descEn: 'Serving urban and coastal congregations with pastoral care, youth leadership, and Christian episcopal marriage services.',
    descTa: 'கடலோர மற்றும் புறநகர் திருச்சபைகளுக்கு மேய்ப்பர்கள் பாதுகாப்பு மற்றும் எபிஸ்கோபல் திருமணப் பதிவுகள் வழங்குகிறது.'
  },
  {
    id: 'villupuram',
    num: '03',
    nameEn: 'ACI Villupuram Diocese',
    nameTa: 'ஏசிஐ விழுப்புரம் பேராயம்',
    zoneEn: 'Villupuram Zone',
    zoneTa: 'விழுப்புரம் மண்டலம்',
    bishopNameEn: 'Rt. Rev. A. Pounraj',
    bishopNameTa: 'Rt. Rev. A. பொன்ராஜ்',
    image: '/dioceses/bishop-3.jpg',
    descEn: 'Uniting independent pastors, conducting revival crusades, and organizing Sunday school teacher training.',
    descTa: 'சுயாதீன போதகர்களை ஒன்றிணைத்து எழுப்புதல் கூட்டங்கள் மற்றும் சிறுவர் ஊழிய ஆசிரியர்கள் பயிற்சி அளிக்கிறது.'
  },
  {
    id: 'madurai',
    num: '04',
    nameEn: 'ACI Madurai Diocese',
    nameTa: 'ஏசிஐ மதுரை பேராயம்',
    zoneEn: 'Madurai Zone',
    zoneTa: 'மதுரை மண்டலம்',
    bishopNameEn: 'Rt. Rev. L. Suresh Daniel',
    bishopNameTa: 'Rt. Rev. L. சுரேஷ் டேனியல்',
    image: '/dioceses/bishop-4.jpg',
    descEn: 'Fostering deep doctrinal clarity, apostolic church visitations, and regional conventions in the southern belt.',
    descTa: 'தென் தமிழகத்தில் அப்போஸ்தல சபை சந்திப்புகள், மண்டல மாநாடுகள் மற்றும் ஆழமான வேத உபதேசங்களை முன்னெடுக்கிறது.'
  },
  {
    id: 'trichy',
    num: '05',
    nameEn: 'ACI Trichy Diocese',
    nameTa: 'ஏசிஐ திருச்சி பேராயம்',
    zoneEn: 'Tiruchirappalli Zone',
    zoneTa: 'திருச்சிராப்பள்ளி மண்டலம்',
    bishopNameEn: 'Rt. Rev. G. Edwin Joseph Selvaraj',
    bishopNameTa: 'Rt. Rev. G. எட்வின் ஜோசப் செல்வராஜ்',
    image: '/dioceses/bishop-5.jpg',
    descEn: 'Theological research hub, Word Sharing meets, and multi-district pastor leadership summits in central Tamil Nadu.',
    descTa: 'காவிரி டெல்டா மற்றும் மத்திய தமிழகத்தில் இறையியல் கருத்தரங்குகள் மற்றும் வார்த்தைப் பகிர்வு கூட்டங்களை நடத்துகிறது.'
  },
  {
    id: 'virudhunagar',
    num: '06',
    nameEn: 'ACI Virudhunagar Diocese',
    nameTa: 'ஏசிஐ விருதுநகர் பேராயம்',
    zoneEn: 'Virudhunagar Zone',
    zoneTa: 'விருதுநகர் மண்டலம்',
    bishopNameEn: 'Rt. Rev. A. Chinnappadoss',
    bishopNameTa: 'Rt. Rev. A. சின்னப்பதாஸ்',
    image: '/dioceses/bishop-6.jpg',
    descEn: 'Spearheading 7-member missionary teams, family enrichment fellowship, and local church strengthening.',
    descTa: '7 பேர் கொண்ட நற்செய்தி குழுக்கள், குடும்ப ஆசீர்வாத ஐக்கியம் மற்றும் சபைகளை பலப்படுத்தும் பணிகளை செய்கிறது.'
  },
  {
    id: 'kanniyakumari',
    num: '07',
    nameEn: 'ACI Kanniyakumari Diocese',
    nameTa: 'ஏசிஐ கன்னியாகுமரி பேராயம்',
    zoneEn: 'Kanniyakumari Coastal Zone',
    zoneTa: 'கன்னியாகுமரி கடலோர மண்டலம்',
    bishopNameEn: 'Rt. Rev. J. Sujin',
    bishopNameTa: 'Rt. Rev. J. சுஜின்',
    image: '/dioceses/bishop-7.jpg',
    descEn: 'Intercessory prayer networks, coastal evangelism, and ministerial fellowship in the southern tip of India.',
    descTa: 'தென் கடலோர பகுதிகளில் இடைவிடா ஜெப நெட்வொர்க், மீனவ மக்கள் சுவிசேஷ பணி மற்றும் போதகர் ஐக்கியம்.'
  }
]

export default function DioceseSection() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const sectionRef = useRef(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els?.length) return
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="diocese"
      className="diocese-home-section section-pad"
      aria-label="Apostolic Council of India Regional Dioceses"
    >
      <div className="container">
        {/* Header Block */}
        <div className="diocese-header reveal">
          <p className="t-label diocese-label" style={{ color: '#c8a96e', letterSpacing: '0.16em', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா மண்டல பேராயங்கள்' : 'APOSTOLIC COUNCIL OF INDIA REGIONAL DIOCESES'}
          </p>
          <h2 className="t-headline diocese-title" style={{ color: '#ffffff' }}>
            {isTa
              ? '7 மண்டல பேராயங்களின் ஒருங்கிணைந்த எபிஸ்கோபல் கட்டமைப்பு'
              : '7 Regional Dioceses of ACI Across Tamil Nadu'}
          </h2>
          <p className="t-body diocese-sub">
            {isTa
              ? 'தமிழ்நாடு முழுவதும் மேய்ப்பர்களுக்கு மேய்ச்சலளித்து, திருச்சபைகளை பலப்படுத்தி, இறைபணியை முன்னெடுக்கும் 7 அதிகாரப்பூர்வ மண்டல பேராயங்கள்.'
              : 'Structured into 7 regional diocesan networks providing episcopal shelter, biblical training, statutory legal backing, and pastoral fellowship.'}
          </p>
        </div>

        {/* 7 Regional Dioceses Grid */}
        <div className="diocese-regions-grid reveal reveal-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {regionalDioceses.map((d) => (
            <div
              key={d.id}
              style={{
                padding: '24px 20px',
                background: '#111111',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#c8a96e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  DIOCESE · {d.num}
                </span>
                {d.image && (
                  <img
                    src={d.image}
                    alt={isTa ? d.bishopNameTa : d.bishopNameEn}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      border: '2px solid #c8a96e',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      flexShrink: 0
                    }}
                  />
                )}
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 600, color: '#ffffff', margin: '0 0 4px 0' }}>
                {isTa ? d.nameTa : d.nameEn}
              </h3>
              <p style={{ fontSize: '12px', color: '#c8a96e', margin: '0 0 10px 0', fontWeight: 500 }}>
                {isTa ? d.bishopNameTa : d.bishopNameEn}
              </p>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.7)' }}>
                {isTa ? d.descTa : d.descEn}
              </p>
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Link
                  to={`/diocese#${d.id}`}
                  style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', letterSpacing: '0.03em' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a96e' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff' }}
                >
                  <span>{isTa ? 'முழு விபரம் காண்க' : 'View Full Details'}</span>
                  <ArrowRightIcon size={11} color="currentColor" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
