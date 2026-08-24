import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { LocationIcon, ArrowRightIcon, ShieldIcon } from '../Icons/SvgIcons'
import './DioceseSection.css'

const regionalDioceses = [
  {
    id: 'tirupattur',
    num: '01',
    nameEn: 'ACI Tirupattur Diocese',
    nameTa: 'ஏசிஐ திருப்பத்தூர் பேராயம்',
    zoneEn: 'Tirupattur Zone',
    zoneTa: 'திருப்பத்தூர் மண்டலம்',
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
    descEn: 'Intercessory prayer networks, coastal evangelism, and ministerial fellowship in the southern tip of India.',
    descTa: 'தென் கடலோர பகுதிகளில் இடைவிடா ஜெப நெட்வொர்க், மீனவ மக்கள் சுவிசேஷ பணி மற்றும் போதகர் ஐக்கியம்.'
  }
]

export default function DioceseSection() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const [selectedDiocese, setSelectedDiocese] = useState(regionalDioceses[0])
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

        {/* 7 Regional Dioceses Interactive Selection Grid */}
        <div className="diocese-regions-grid reveal reveal-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {regionalDioceses.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDiocese(d)}
              style={{
                cursor: 'pointer',
                padding: '24px 20px',
                background: selectedDiocese.id === d.id ? 'rgba(200, 169, 110, 0.08)' : '#111111',
                border: selectedDiocese.id === d.id ? '1.5px solid #c8a96e' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#c8a96e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  DIOCESE · {d.num}
                </span>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <LocationIcon size={12} color="#c8a96e" />
                  <span>{isTa ? d.zoneTa : d.zoneEn}</span>
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                {isTa ? d.nameTa : d.nameEn}
              </h3>
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

        {/* Selected Diocese Highlight Box */}
        {selectedDiocese && (
          <div className="reveal reveal-delay-2" style={{ background: '#111111', border: '1px solid rgba(200, 169, 110, 0.3)', borderRadius: '6px', padding: '28px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ color: '#c8a96e', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  FEATURED DIOCESE · {selectedDiocese.num}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
                  {isTa ? selectedDiocese.nameTa : selectedDiocese.nameEn}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '750px', lineHeight: '1.7' }}>
                  {isTa ? selectedDiocese.descTa : selectedDiocese.descEn}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to={`/diocese#${selectedDiocese.id}`} className="btn btn-white" style={{ background: '#ffffff', color: '#000000', padding: '10px 20px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', borderRadius: '4px' }}>
                  {isTa ? 'மண்டல விபரம்' : 'Diocese Details'} <span className="arrow">→</span>
                </Link>
                <Link to="/contact" className="btn btn-outline" style={{ border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff', padding: '10px 20px', fontSize: '13px', textDecoration: 'none', borderRadius: '4px' }}>
                  {isTa ? 'தொடர்பு கொள்ள' : 'Contact Diocese'}
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
