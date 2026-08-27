import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { LocationIcon, ChurchIcon, PhoneIcon, EmailIcon, IdCardIcon } from '../components/Icons/SvgIcons'
import { diocesesList } from '../data/diocesesData'

export default function DiocesePage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  return (
    <div style={{ paddingTop: '76px', background: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      
      {/* Hero Header */}
      <div style={{ background: '#111111', padding: '64px 0 48px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p className="t-label" style={{ color: '#c8a96e', marginBottom: '8px', letterSpacing: '0.16em', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயங்கள்' : 'APOSTOLIC COUNCIL OF INDIA DIOCESES'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, marginBottom: '16px', color: '#ffffff' }}>
            {isTa ? 'ஏசிஐ மண்டல பேராயங்களின் கூட்டமைப்பு' : '7 Regional Dioceses of ACI'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '820px', fontSize: '15px', lineHeight: '1.7' }}>
            {isTa
              ? 'தமிழ்நாடு முழுவதும் பரந்து விரிந்து தேவ ஊழியங்களை தாங்கி நடத்தும் 7 அதிகாரப்பூர்வ மண்டல பேராயங்களின் சபைகள் மற்றும் தலைமை விபரம்.'
              : 'Discover the seven regional diocesan networks operating across Tamil Nadu under the Apostolic Council of India, empowering pastors, planting vibrant local churches, and advancing the Kingdom of God.'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '64px 24px 80px' }}>

        {/* Overview Banner */}
        <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.12)', borderLeft: '4px solid #c8a96e', padding: '28px 32px', marginBottom: '56px', borderRadius: '6px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#ffffff', marginBottom: '8px', fontWeight: 400 }}>
            {isTa ? 'மண்டல பேராயங்களின் ஒருங்கிணைந்த கட்டமைப்பு' : 'Unified Episcopal Governance Across 7 Regional Dioceses'}
          </h3>
          <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            {isTa
              ? 'ஒவ்வொரு மண்டல பேராயமும் மத்திய பேராய தலைமை மற்றும் சினோட் ஆலோசனை மன்றத்தின் கீழ் இயங்கி, அந்தந்த மாவட்டங்களில் உள்ள சபைகளுக்கும் ஊழியர்களுக்கும் ஆவிக்குரிய, சட்டப்பூர்வ மற்றும் மிஷனெரி உதவிகளை வழங்கி வருகிறது.'
              : 'Each regional diocese operates under central apostolic episcopal oversight and the Synod Advisory Council, providing biblical ordination, pastoral shelter, legal accreditation, and missionary backing to local congregations.'}
          </p>
        </div>

        {/* 7 Dioceses List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {diocesesList.map((d) => (
            <section
              key={d.id}
              id={d.id}
              style={{
                scrollMarginTop: '100px',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                background: '#111111',
                padding: '36px',
                position: 'relative'
              }}
            >
              {/* Bishop image – top right corner, like homepage */}
              {d.image && (
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '2.5px solid #c8a96e',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  flexShrink: 0
                }}>
                  <img
                    src={d.image}
                    alt={d.pastorName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                </div>
              )}

              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px', paddingRight: d.image ? '100px' : '0' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#c8a96e', textTransform: 'uppercase' }}>
                    DIOCESE · {d.num}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3.5vw, 34px)', color: '#ffffff', marginTop: '6px', marginBottom: '4px', fontWeight: 400 }}>
                    {isTa ? d.nameTa : d.nameEn}
                  </h2>
                  <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                    {isTa ? d.nameEn : d.nameTa} • {isTa ? d.regionTa : d.region}
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200, 169, 110, 0.1)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '4px' }}>
                  <LocationIcon size={13} color="#c8a96e" />
                  <span>{isTa ? d.headquartersTa : d.headquarters}</span>
                </div>
              </div>

              <p style={{ fontSize: '14.5px', lineHeight: '1.75', color: 'rgba(255,255,255,0.8)', marginBottom: '28px' }}>
                {isTa ? d.descriptionTa : d.descriptionEn}
              </p>

              {/* Church Address & Presiding Pastor Card */}
              {d.address && (
                <div style={{
                  background: 'linear-gradient(145deg, rgba(200, 169, 110, 0.08) 0%, rgba(20, 20, 20, 0.95) 100%)',
                  border: '1px solid rgba(200, 169, 110, 0.28)',
                  borderRadius: '6px',
                  padding: '24px 28px',
                  marginBottom: '28px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(200, 169, 110, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChurchIcon size={17} color="#c8a96e" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: 0, fontFamily: 'var(--font-serif)' }}>
                          {isTa ? (d.churchNameTa || d.churchName) : d.churchName}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                          {isTa ? 'முதன்மை மண்டல சபை மையம்' : 'Diocesan Church Center & Pastoral Office'}
                        </span>
                      </div>
                    </div>
                    {d.regNo && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', color: '#c8a96e', fontWeight: 600 }}>
                        <IdCardIcon size={13} color="#c8a96e" />
                        <span>Reg: {d.regNo}</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                    {/* Bishop Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8a96e', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                          {isTa ? 'பேராயர்' : 'Bishop'}
                        </span>
                        <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff', margin: '0 0 2px 0' }}>
                          {isTa ? (d.pastorNameTa || d.pastorName) : d.pastorName}
                        </p>
                        <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.6)' }}>
                          {isTa ? (d.pastorDesignationTa || d.pastorDesignation) : d.pastorDesignation}
                        </span>
                      </div>
                    </div>

                    {/* Church Address */}
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c8a96e', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                        {isTa ? 'சபை முகவரி' : 'Church Address'}
                      </span>
                      <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <LocationIcon size={15} color="#c8a96e" style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{isTa ? (d.addressTa || d.address) : d.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {d.phone && (
                      <a
                        href={`tel:${d.phone.replace(/[^0-9+]/g, '')}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(200, 169, 110, 0.12)',
                          border: '1px solid rgba(200, 169, 110, 0.25)',
                          color: '#e4caa0',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <PhoneIcon size={13} color="#c8a96e" />
                        <span>{d.phone}</span>
                      </a>
                    )}
                    {d.email && (
                      <a
                        href={`mailto:${d.email}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: 'rgba(255, 255, 255, 0.85)',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          fontSize: '12.5px',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <EmailIcon size={13} color="#c8a96e" />
                        <span>{d.email}</span>
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((d.churchName || '') + ' ' + (d.address || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'rgba(255, 255, 255, 0.65)',
                        padding: '6px 10px',
                        fontSize: '12px',
                        textDecoration: 'underline',
                        marginLeft: 'auto'
                      }}
                    >
                      <span>{isTa ? 'வரைபடத்தில் பார்க்க ↗' : 'View on Google Maps ↗'}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '20px 24px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '14px', fontWeight: 700 }}>
                  {isTa ? 'முக்கிய அமைப்புகள் & செயல்பாடுகள்' : 'Key Pillars & Active Ministries'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {d.highlights.map((h, hi) => (
                    <div key={hi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#ffffff' }}>
                      <StarIcon size={9} color="#c8a96e" />
                      <span>{isTa ? h.ta : h.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/contact" style={{ background: '#ffffff', color: '#000000', padding: '10px 22px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>{isTa ? 'தொடர்பு கொள்ள' : 'Contact Diocese'}</span>
                  <ArrowRightIcon size={12} color="#000000" />
                </Link>
                <Link to="/activities" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: '#ffffff', padding: '10px 22px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>{isTa ? 'செயல்பாடுகள் பார்க்க' : 'View Activities'}</span>
                  <ArrowRightIcon size={12} color="#ffffff" />
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* Central Secretariat Card */}
        <div style={{ marginTop: '64px', padding: '36px', background: '#111111', border: '1px solid rgba(200, 169, 110, 0.3)', borderRadius: '6px', color: '#ffffff' }}>
          <p className="t-label" style={{ color: '#c8a96e', marginBottom: '8px', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
            {isTa ? 'மத்திய பேராய தலைமை அலுவலகம்' : 'CENTRAL DIOCESAN SECRETARIAT'}
          </p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px', fontWeight: 400, color: '#ffffff' }}>
            Apostolic Council of India Diocese
          </h3>
          <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
            6/110, Melapatty, Hanumantharayan Kottai, Dindigul District, Tamil Nadu – 624002, India.<br />
            <strong>Email:</strong> rev.johnsondurai@gmail.com | <strong>Founder:</strong> The Most Rev. S. Johnson Durai
          </p>
          <Link to="/about#about-diocese" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff', color: '#000000', padding: '10px 22px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', borderRadius: '4px' }}>
            <span>{isTa ? 'முழு பேராய விபரம்' : 'Central Diocese Details'}</span>
            <ArrowRightIcon size={12} color="#000000" />
          </Link>
        </div>

      </div>
    </div>
  )
}
