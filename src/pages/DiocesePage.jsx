import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export const diocesesList = [
  {
    id: 'tirupattur',
    num: '01',
    nameEn: 'ACI Tirupattur Diocese',
    nameTa: 'ஏசிஐ திருப்பத்தூர் பேராயம்',
    headquarters: 'Tirupattur Zone',
    headquartersTa: 'திருப்பத்தூர் மண்டலம்',
    region: 'Northern Tamil Nadu Region',
    regionTa: 'வட தமிழக மண்டலம்',
    descriptionEn: 'Shepherding churches and pastoral ministers across Tirupattur, Vaniyambadi, Ambur, Natrampalli, and adjoining rural mission fields with active youth evangelism and ministry training.',
    descriptionTa: 'திருப்பத்தூர், வாணியம்பாடி, ஆம்பூர், நாட்ராம்பள்ளி மற்றும் சுற்றியுள்ள கிராமப்புற சுவிசேஷப் பணிகளை ஒருங்கிணைத்து போதகர்களையும் சபைகளையும் தாங்கி நடத்தும் பேராயம்.',
    highlights: [
      { en: 'Pastoral Fellowship & Leadership Training', ta: 'மேய்ப்பர்கள் ஐக்கியம் & தலைமைத்துவ பயிற்சி' },
      { en: 'Rural Mission & Church Planting Wings', ta: 'கிராமப்புற நற்செய்தி பணி & சபை நிறுவுதல்' },
      { en: 'Zonal Pastors Word Fellowship', ta: 'மண்டல போதகர்கள் வேத ஆராய்ச்சி கூட்டம்' }
    ]
  },
  {
    id: 'chengalpattu',
    num: '02',
    nameEn: 'ACI Chengalpattu Diocese',
    nameTa: 'ஏசிஐ செங்கல்பட்டு பேராயம்',
    headquarters: 'Chengalpattu Zone',
    headquartersTa: 'செங்கல்பட்டு மண்டலம்',
    region: 'Coastal & Greater Chennai Corridor',
    regionTa: 'கடலோர & சென்னை புறநகர் மண்டலம்',
    descriptionEn: 'Serving urban, suburban, and coastal congregations with dynamic youth development, pastoral care, and episcopal support across Chengalpattu and Kanchipuram belts.',
    descriptionTa: 'செங்கல்பட்டு, காஞ்சிபுரம் மற்றும் கடலோரப் பகுதிகளில் உள்ள திருச்சபைகளுக்கு ஆவிக்குரிய வழிகாட்டுதல், வாலிபர் எழுப்புதல் மற்றும் ஊழியர்களுக்கு தகுதி உயர்வு வழங்கும் பேராயம்.',
    highlights: [
      { en: 'Urban & Suburban Outreach Networks', ta: 'நகர்ப்புற & புறநகர் நற்செய்தி நெட்வொர்க்' },
      { en: 'Youth & Next-Gen Leadership Programs', ta: 'வாலிபர் & அடுத்த தலைமுறை தலைமைத்துவப் பயிற்சி' },
      { en: 'Episcopal Marriage Officiation Services', ta: 'சட்டப்பூர்வ எபிஸ்கோபல் திருமணப் பதிவுகள்' }
    ]
  },
  {
    id: 'villupuram',
    num: '03',
    nameEn: 'ACI Villupuram Diocese',
    nameTa: 'ஏசிஐ விழுப்புரம் பேராயம்',
    headquarters: 'Villupuram Zone',
    headquartersTa: 'விழுப்புரம் மண்டலம்',
    region: 'Central North Tamil Nadu Belt',
    regionTa: 'மத்திய வட தமிழக மண்டலம்',
    descriptionEn: 'Spearheading revival crusades, Sunday School teacher certification, and establishing strong interdenominational unity among independent pastors in Villupuram district.',
    descriptionTa: 'விழுப்புரம் மாவட்டத்தின் சுயாதீன போதகர்களை ஒன்றிணைத்து, எழுப்புதல் கூட்டங்கள், சிறுவர் ஊழிய ஆசிரியர்கள் பயிற்சி மற்றும் சபை சந்திப்புகளை நடத்தும் பேராயம்.',
    highlights: [
      { en: 'Independent Pastors Ordination Support', ta: 'சுயாதீன போதகர்களுக்கான பிரதிஷ்டை உதவி' },
      { en: 'VBS Directors & Children Ministry Wings', ta: 'VBS மற்றும் சிறுவர் ஊழிய வழிகாட்டுதல்' },
      { en: 'Village Crusades & Tract Distribution', ta: 'கிராமப்புற கூட்டங்கள் & சுவிசேஷப் பிரசுர பணி' }
    ]
  },
  {
    id: 'madurai',
    num: '04',
    nameEn: 'ACI Madurai Diocese',
    nameTa: 'ஏசிஐ மதுரை பேராயம்',
    headquarters: 'Madurai Zone',
    headquartersTa: 'மதுரை மண்டலம்',
    region: 'Southern Heritage & Central South Belt',
    regionTa: 'தென் தமிழக கலாச்சார & வரலாற்று மண்டலம்',
    descriptionEn: 'Fostering deep doctrinal clarity, apostolic church visitations, and large-scale regional conventions uniting hundreds of faithful servants of the Lord.',
    descriptionTa: 'மதுரை மற்றும் அதன் சுற்றுவட்டார பகுதிகளில் அப்போஸ்தல சபை சந்திப்புகள், மண்டல மாநாடுகள் மற்றும் ஆழமான வேத உபதேச கூட்டங்களை நடத்தும் பேராயம்.',
    highlights: [
      { en: 'Regional Annual Diocesan Conventions', ta: 'மண்டல வருடாந்திர பேராய மாநாடுகள்' },
      { en: 'Fivefold Ministry Activation & Teaching', ta: 'ஐவகை ஊழியங்களை செயல்படுத்துதல் & போதனை' },
      { en: 'Pastoral Counseling & Church Welfare', ta: 'மேய்ப்பர்கள் ஆலோசனை & சபை நலப்பணிகள்' }
    ]
  },
  {
    id: 'trichy',
    num: '05',
    nameEn: 'ACI Trichy Diocese',
    nameTa: 'ஏசிஐ திருச்சி பேராயம்',
    headquarters: 'Tiruchirappalli Zone',
    headquartersTa: 'திருச்சிராப்பள்ளி மண்டலம்',
    region: 'Central Tamil Nadu Hub',
    regionTa: 'மத்திய தமிழக இதய மண்டலம்',
    descriptionEn: 'Serving as a central hub for theological workshops, Word Sharing meets, and multi-district pastor leadership summits in the Cauvery delta region.',
    descriptionTa: 'காவிரி டெல்டா பகுதியில் இறையியல் கருத்தரங்குகள், வார்த்தைப் பகிர்வு கூட்டங்கள் மற்றும் மாவட்ட அளவிலான போதகர்கள் மாநாடுகளை ஒருங்கிணைக்கும் பேராயம்.',
    highlights: [
      { en: 'Theological Seminars & Word Research', ta: 'இறையியல் கருத்தரங்குகள் & வசன ஆராய்ச்சி' },
      { en: 'Delta Region Church Visitation Wings', ta: 'டெல்டா பகுதி சபை சந்திப்புப் பணிக் குழு' },
      { en: 'Ministerial Certification & Training', ta: 'ஊழியர்கள் சான்றிதழ் & மேம்பாட்டு பயிற்சி' }
    ]
  },
  {
    id: 'virudhunagar',
    num: '06',
    nameEn: 'ACI Virudhunagar Diocese',
    nameTa: 'ஏசிஐ விருதுநகர் பேராயம்',
    headquarters: 'Virudhunagar Zone',
    headquartersTa: 'விருதுநகர் மண்டலம்',
    region: 'South Central Industrial & Rural Sector',
    regionTa: 'தென் மத்திய தொழில் & கிராமப்புற மண்டலம்',
    descriptionEn: 'Active in missionary evangelism, women and family empowerment, pastoral relief, and church building encouragement across southern districts.',
    descriptionTa: 'விருதுநகர், சிவகாசி, ராஜபாளையம் பகுதிகளில் மிஷனெரி சுவிசேஷப் பணிகள், குடும்ப ஆலோசனைகள் மற்றும் சபைகளை பலப்படுத்தும் ஊழியங்களை முன்னெடுக்கும் பேராயம்.',
    highlights: [
      { en: 'Missionary Outreach & 7-Member Teams', ta: '7 பேர் கொண்ட சுவிசேஷ ஊழியக் குழுக்கள்' },
      { en: 'Family Enrichment & Women Fellowship', ta: 'குடும்ப ஆசீர்வாத & சகோதரிகள் ஐக்கியம்' },
      { en: 'Zonal Spiritual Gatherings', ta: 'மண்டல அளவிலான ஆவிக்குரிய எழுப்புதல் கூட்டங்கள்' }
    ]
  },
  {
    id: 'kanniyakumari',
    num: '07',
    nameEn: 'ACI Kanniyakumari Diocese',
    nameTa: 'ஏசிஐ கன்னியாகுமரி பேராயம்',
    headquarters: 'Kanniyakumari Zone',
    headquartersTa: 'கன்னியாகுமரி மண்டலம்',
    region: 'Southernmost Coastal Belt',
    regionTa: 'தென் முனை கடலோர மண்டலம்',
    descriptionEn: 'Strengthening coastal churches, prayer tower ministries, intercessory networks, and theological student mentorship in the southern tip of India.',
    descriptionTa: 'இந்தியாவின் தென் முனையில் கடலோர சபைகளை பலப்படுத்தி, திறப்பின் வாசல் ஜெப வீரர்கள் நெட்வொர்க் மற்றும் ஆவிக்குரிய தலைவர்களை உருவாக்கும் பேராயம்.',
    highlights: [
      { en: '24/7 Intercessory Prayer Networks', ta: 'திறப்பின் வாசல் இடைவிடா ஜெப நெட்வொர்க்' },
      { en: 'Coastal Evangelism & Church Empowerment', ta: 'கடலோர சுவிசேஷ பணி & சபை வலுவூட்டல்' },
      { en: 'Ordained Ministers Fellowship Meets', ta: 'பிரதிஷ்டை பெற்ற ஊழியர்களின் ஐக்கியக் கூடல்' }
    ]
  }
]

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
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Header */}
      <div style={{ background: 'var(--color-near-black)', color: 'var(--color-white)', padding: '60px 0 44px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p className="t-label" style={{ color: '#c8a96e', marginBottom: '8px', letterSpacing: '0.15em' }}>
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயங்கள்' : 'APOSTOLIC COUNCIL OF INDIA DIOCESES'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, marginBottom: '14px' }}>
            {isTa ? 'ஏசிஐ மண்டல பேராயங்களின் கூட்டமைப்பு' : '7 Regional Dioceses of ACI'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '820px', fontSize: '16px', lineHeight: '1.7' }}>
            {isTa
              ? 'தமிழ்நாடு முழுவதும் பரந்து விரிந்து தேவ ஊழியங்களை தாங்கி நடத்தும் 7 அதிகாரப்பூர்வ மண்டல பேராயங்களின் விபரம்.'
              : 'Discover the seven regional diocesan networks operating across Tamil Nadu under the Apostolic Council of India, empowering pastors and advancing the Kingdom of God.'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '64px 20px' }}>

        {/* Overview Banner */}
        <div style={{ background: 'var(--color-soft-gray)', borderLeft: '4px solid #c8a96e', padding: '28px 32px', marginBottom: '56px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--color-text-dark)', marginBottom: '8px' }}>
            {isTa ? 'மண்டல பேராயங்களின் ஒருங்கிணைந்த கட்டமைப்பு' : 'Unified Episcopal Governance Across 7 Regional Dioceses'}
          </h3>
          <p style={{ fontSize: '15px', lineHeight: '1.75', color: 'var(--color-text-mid)' }}>
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
                border: '1px solid var(--color-divider-light)',
                background: 'var(--color-white)',
                padding: '36px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', color: '#c8a96e', textTransform: 'uppercase' }}>
                    DIOCESE · {d.num}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--color-text-dark)', marginTop: '4px' }}>
                    {isTa ? d.nameTa : d.nameEn}
                  </h2>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {isTa ? d.nameEn : d.nameTa} • {isTa ? d.regionTa : d.region}
                  </span>
                </div>
                <div style={{ background: 'var(--color-near-black)', color: '#c8a96e', padding: '8px 18px', fontSize: '13px', fontWeight: 600 }}>
                  📍 {isTa ? d.headquartersTa : d.headquarters}
                </div>
              </div>

              <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--color-text-mid)', marginBottom: '24px' }}>
                {isTa ? d.descriptionTa : d.descriptionEn}
              </p>

              <div style={{ background: 'var(--color-soft-gray)', padding: '20px 24px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-dark)', marginBottom: '12px', fontWeight: 700 }}>
                  {isTa ? 'முக்கிய அமைப்புகள் & செயல்பாடுகள்' : 'Key Pillars & Active Ministries'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {d.highlights.map((h, hi) => (
                    <div key={hi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--color-text-dark)' }}>
                      <span style={{ color: '#c8a96e', fontSize: '16px' }}>✦</span>
                      <span>{isTa ? h.ta : h.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-dark" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  {isTa ? 'தொடர்பு கொள்ள' : 'Contact Diocese'} <span className="arrow">→</span>
                </Link>
                <Link to="/activities" className="btn btn-light" style={{ border: '1px solid #ccc', padding: '10px 20px', fontSize: '13px' }}>
                  {isTa ? 'செயல்பாடுகள் பார்க்க' : 'View Activities'} <span className="arrow">→</span>
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* Central Secretariat Card */}
        <div style={{ marginTop: '64px', padding: '36px', background: 'var(--color-near-black)', color: 'var(--color-white)' }}>
          <p className="t-label" style={{ color: '#c8a96e', marginBottom: '8px' }}>
            {isTa ? 'மத்திய பேராய தலைமை அலுவலகம்' : 'CENTRAL DIOCESAN SECRETARIAT'}
          </p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '12px', fontWeight: 400 }}>
            Apostolic Council of India Diocese
          </h3>
          <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>
            6/110, Melapatty, Hanumantharayan Kottai, Dindigul District, Tamil Nadu – 624002, India.<br />
            <strong>Email:</strong> rev.johnsondurai@gmail.com | <strong>Founder:</strong> The Most Rev. S. Johnson Durai
          </p>
          <Link to="/about#about-diocese" className="btn btn-light" style={{ display: 'inline-flex' }}>
            {isTa ? 'முழு பேராய விபரம்' : 'Central Diocese Details'} <span className="arrow">→</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
