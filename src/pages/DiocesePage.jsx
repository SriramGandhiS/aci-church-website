import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { LocationIcon, StarIcon, ArrowRightIcon } from '../components/Icons/SvgIcons'

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
      { en: 'Church Construction & Pastoral Welfare Support', ta: 'சபை கட்டிடப் பணிகள் & மேய்ப்பர்கள் நல உதவிகள்' }
    ]
  },
  {
    id: 'trichy',
    num: '05',
    nameEn: 'ACI Trichy Diocese',
    nameTa: 'ஏசிஐ திருச்சி பேராயம்',
    headquarters: 'Tiruchirappalli Zone',
    headquartersTa: 'திருச்சிராப்பள்ளி மண்டலம்',
    region: 'Cauvery Delta & Central Tamil Nadu Hub',
    regionTa: 'காவிரி டெல்டா & மத்திய தமிழக மண்டலம்',
    descriptionEn: 'Theological research hub organizing bi-monthly Word Sharing meets, pastoral leadership summits, and inter-church fellowship.',
    descriptionTa: 'திருச்சிராப்பள்ளி மற்றும் டெல்டா மாவட்டங்களில் இறையியல் கருத்தரங்குகள், இரண்டு மாதங்களுக்கு ஒருமுறை நடைபெறும் வார்த்தைப் பகிர்வு கூட்டங்களை நடத்தும் பேராயம்.',
    highlights: [
      { en: 'Theological Seminars & Sound Doctrine Training', ta: 'இறையியல் கருத்தரங்குகள் & உபதேசப் பயிற்சி' },
      { en: 'Pastoral Counseling & Discipleship Wings', ta: 'போதகர்கள் ஆலோசனைகள் & சீஷத்துவப் பணி' },
      { en: 'Delta Region Gospel Proclamation Outreaches', ta: 'டெல்டா மண்டல நற்செய்தி அறிவிப்பு கூட்டங்கள்' }
    ]
  },
  {
    id: 'virudhunagar',
    num: '06',
    nameEn: 'ACI Virudhunagar Diocese',
    nameTa: 'ஏசிஐ விருதுநகர் பேராயம்',
    headquarters: 'Virudhunagar Zone',
    headquartersTa: 'விருதுநகர் மண்டலம்',
    region: 'Southern Mission Belt',
    regionTa: 'தெற்கு மிஷனெரி மண்டலம்',
    descriptionEn: 'Mobilizing 7-member missionary teams, family enrichment programs, and planting vibrant local church communities.',
    descriptionTa: 'விருதுநகர் மற்றும் சுற்றுவட்டார பகுதிகளில் 7 நபர் சுவிசேஷக் குழுக்கள், குடும்ப ஆசீர்வாத முகாம்கள் மற்றும் புதிய சபை நிறுவும் பணிகளை முன்னெடுக்கும் பேராயம்.',
    highlights: [
      { en: '7-Member Evangelistic Gospel Teams', ta: '7 நபர் நற்செய்தி சுவிசேஷக் குழுக்கள்' },
      { en: 'Family Enrichment & Pastoral Care Retreats', ta: 'குடும்ப ஆசீர்வாத முகாம்கள் & மேய்ப்பர் ஓய்வு நாட்கள்' },
      { en: 'Rural Literature & Film Ministry Wings', ta: 'கிராமப்புற வேத பிரசுரங்கள் & படக்காட்சி ஊழியம்' }
    ]
  },
  {
    id: 'kanniyakumari',
    num: '07',
    nameEn: 'ACI Kanniyakumari Diocese',
    nameTa: 'ஏசிஐ கன்னியாகுமரி பேராயம்',
    headquarters: 'Nagercoil / Kanniyakumari Zone',
    headquartersTa: 'நாகர்கோவில் / கன்னியாகுமரி மண்டலம்',
    region: 'Southern Coastal Tip & Multi-Language Mission',
    regionTa: 'தென் கடலோர & இருமொழி மிஷனெரி மண்டலம்',
    descriptionEn: 'Advancing coastal ministry, cross-cultural missions, youth leadership training, and theological publications in the southernmost district.',
    descriptionTa: 'கன்னியாகுமரி மாவட்டத்தின் கடலோர கிராமங்களில் நற்செய்தி அறிவித்தல், வாலிபர் மாநாடுகள் மற்றும் வேத இலக்கிய வெளியீடுகளை வழிநடத்தும் பேராயம்.',
    highlights: [
      { en: 'Coastal & Fisherfolk Community Missions', ta: 'கடலோர மக்கள் நற்செய்தி ஊழியம்' },
      { en: 'Youth Leadership Camps & Bible Training', ta: 'வாலிபர் தலைமைத்துவ முகாம்கள் & வேதப் பயிற்சி' },
      { en: 'Interdenominational Pastoral Unity Meets', ta: 'திருச்சபைகள் ஐக்கிய போதகர்கள் கூட்டங்கள்' }
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
              ? 'தமிழ்நாடு முழுவதும் பரந்து விரிந்து தேவ ஊழியங்களை தாங்கி நடத்தும் 7 அதிகாரப்பூர்வ மண்டல பேராயங்களின் விபரம்.'
              : 'Discover the seven regional diocesan networks operating across Tamil Nadu under the Apostolic Council of India, empowering pastors and advancing the Kingdom of God.'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '64px 24px 80px' }}>

        {/* Overview Banner */}
        <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.12)', borderLeft: '4px solid #c8a96e', padding: '28px 32px', marginBottom: '56px', borderRadius: '4px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {diocesesList.map((d) => (
            <section
              key={d.id}
              id={d.id}
              style={{
                scrollMarginTop: '100px',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                background: '#111111',
                padding: '36px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', color: '#c8a96e', textTransform: 'uppercase' }}>
                    DIOCESE · {d.num}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3.5vw, 34px)', color: '#ffffff', marginTop: '6px', marginBottom: '4px', fontWeight: 400 }}>
                    {isTa ? d.nameTa : d.nameEn}
                  </h2>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                    {isTa ? d.nameEn : d.nameTa} • {isTa ? d.regionTa : d.region}
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200, 169, 110, 0.1)', border: '1px solid rgba(200, 169, 110, 0.3)', color: '#c8a96e', padding: '6px 14px', fontSize: '12px', fontWeight: 600, borderRadius: '4px' }}>
                  <LocationIcon size={13} color="#c8a96e" />
                  <span>{isTa ? d.headquartersTa : d.headquarters}</span>
                </div>
              </div>

              <p style={{ fontSize: '14.5px', lineHeight: '1.75', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
                {isTa ? d.descriptionTa : d.descriptionEn}
              </p>

              <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
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
