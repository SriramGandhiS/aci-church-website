import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { CameraIcon, ArrowRightIcon } from '../Icons/SvgIcons'

const activitiesList = [
  {
    id: 'ordination',
    titleEn: 'ORDINATION',
    titleTa: 'பிரதிஷ்டை ஊழியம்',
    summaryEn: 'Bi-annual Episcopal Ordination of fivefold ministers (Apostles, Prophets, Pastors, Teachers, Evangelists) actively laboring in God’s vineyard for at least 5 years.',
    summaryTa: 'தேவனின் திராட்சைத் தோட்டத்தில் குறைந்தது 5 ஆண்டுகள் உண்மையாய் பணியாற்றிய ஐவகை ஊழியர்களுக்கு வழங்கப்படும் எபிஸ்கோபல் பிரதிஷ்டை.',
    detailsEn: 'Ordination takes place twice a year at the Central Diocesan Office upon confession of faith and confirmation of calling as per the Word of God and Indian law to exercise Christian Episcopal rights.',
    detailsTa: 'விசுவாச அறிக்கை மற்றும் வேத அழைப்பின் உறுதிப்பாட்டின்படி மத்திய பேராய அலுவலகத்தில் ஆண்டுக்கு இருமுறை எபிஸ்கோபல் பிரதிஷ்டை ஆராதனை நடைபெறுகிறது.',
    cat: 'Ordination',
  },
  {
    id: 'wordsharingmeet',
    titleEn: 'WORD SHARING MEET',
    titleTa: 'வார்த்தைப் பகிர்வு கூட்டம்',
    summaryEn: 'Diocesan members gather at regular intervals to search, learn, and enrich themselves in the Word of God under key theological titles.',
    summaryTa: 'பேராய அங்கத்தினர்கள் தேவ வார்த்தையை தேடி கற்றுக்கொள்ளவும், வேத அறிவில் ஆழமாய் வளரவும் ஒழுங்கு செய்யப்படும் ஐக்கியக் கூட்டங்கள்.',
    detailsEn: 'Equipping pastors and leaders with deep scriptural foundation, doctrinal clarity, and practical ministry tools.',
    detailsTa: 'போதகர்களுக்கும் தலைவர்களுக்கும் ஆழமான வேத அஸ்திபாரம், உபதேச தெளிவு மற்றும் ஊழிய திறன்களை வழங்குகிறது.',
    cat: 'Word Sharing Meet',
  },
  {
    id: 'zonalmeet',
    titleEn: 'ZONAL MEET',
    titleTa: 'மண்டலக் கூட்டங்கள்',
    summaryEn: 'Regional fellowship gatherings of existing and prospective members of ACI Diocese across zones in Tamil Nadu and India.',
    summaryTa: 'மண்டல அளவில் பேராயத்தின் தற்போதைய மற்றும் வருங்கால உறுப்பினர்களை ஒன்றிணைக்கும் எழுப்புதல் ஐக்கியக் கூட்டங்கள்.',
    detailsEn: 'Includes praise, worship, word teaching, and detailed synopsis of diocesan activities to encourage local church ministers.',
    detailsTa: 'துதி, ஆராதனை மற்றும் தேவ செய்தி மூலம் மண்டல திருச்சபைகளும் போதகர்களும் ஆவியிலே உற்சாகப்படுத்தப்படுகின்றனர்.',
    cat: 'Zonal Meet',
  },
  {
    id: 'churchvisit',
    titleEn: 'CHURCH VISIT',
    titleTa: 'சபை சந்திப்பு',
    summaryEn: 'Trustees of the board accompanied by District Overseers (DOS) visit member churches as Apostle Paul did.',
    summaryTa: 'அப்போஸ்தல பவுலைப் போல வாரிய அறங்காவலர்கள் மற்றும் மாவட்ட மேற்பார்வையாளர்கள் அங்கத்துவ சபைகளை நேரில் சந்திக்கின்றனர்.',
    detailsEn: 'Visiting local congregations to advise, equip, counsel, and pray with pastors and believers to strengthen their ministries.',
    detailsTa: 'ஸ்தல சபைகளை நேரில் சந்தித்து ஆலோசனைகள் வழங்கி, மேய்ப்பர்களையும் விசுவாசிகளையும் தேவ சமுகத்தில் தாங்கி ஜெபிக்கின்றனர்.',
    cat: 'Church Visit',
  },
  {
    id: 'childrenministry',
    titleEn: 'CHILDREN MINISTRY & VBS',
    titleTa: 'சிறுவர் ஊழியம் & VBS',
    summaryEn: 'Training Sunday School teachers, Children’s Clubs, VBS directors & teacher training, and equipping children’s ministers.',
    summaryTa: 'ஞாயிறு பள்ளி ஆசிரியர் பயிற்சி, சிறுவர் மன்றங்கள், விபிஎஸ் (VBS) இயக்குனர் பயிற்சி மற்றும் சிறுவர் ஊழியர்களை உருவாக்குதல்.',
    detailsEn: 'Conducting comprehensive Vacation Bible School (VBS) training camps and equipping leaders to reach the next generation.',
    detailsTa: 'அடுத்த தலைமுறையை கிறிஸ்துவுக்குள் வழிநடத்த விரிவான விபிஎஸ் (VBS) பயிற்சி முகாம்கள் மற்றும் கருத்தரங்குகள் நடத்தப்படுகின்றன.',
    cat: 'Children Ministry',
  },
  {
    id: 'youthministry',
    titleEn: 'YOUTH MINISTRY',
    titleTa: 'வாலிபர் ஊழியம்',
    summaryEn: '4-Pillar development training for youth leaders and young believers.',
    summaryTa: 'இளைஞர்கள் மற்றும் வாலிப தலைவர்களுக்கான 4 தூண்கள் கொண்ட ஆவிக்குரிய ஆளுமை வளர்ச்சிப் பயிற்சி.',
    detailsEn: '1) Leadership Training, 2) Discipleship Training, 3) Personality Development, 4) Evangelism Skills.',
    detailsTa: '1) தலைமைத்துவப் பயிற்சி, 2) சீஷத்துவப் பயிற்சி, 3) ஆளுமை மேம்பாடு, 4) சுவிசேஷப் பகிர்வு திறன்கள்.',
    cat: 'Youth Ministry',
  },
  {
    id: 'outreach',
    titleEn: 'OUTREACH & MISSIONS',
    titleTa: 'புறசந்திப்பு & சுவிசேஷ ஊழியம்',
    summaryEn: 'Forming 7-member Gospel teams from Diocese members to reach unreached areas alongside local churches.',
    summaryTa: 'பேராய உறுப்பினர்களில் 7 பேர் கொண்ட சுவிசேஷக் குழுக்களை உருவாக்கி சுவிசேஷம் சென்றடையாத பகுதிகளை சென்றடைதல்.',
    detailsEn: 'Reaching communities through children ministry, film shows, street preaching, tract distribution, and gospel crusades.',
    detailsTa: 'சிறுவர் ஊழியம், படக்காட்சிகள், தெருமுனைப் பிரசங்கங்கள், கைப்பிரதிகள் மற்றும் நற்செய்தி பெருங்கூட்டங்கள் மூலம் சுவிசேஷம் அறிவித்தல்.',
    cat: 'Others',
  },
]

export default function MinistriesSection() {
  const { t, lang } = useLanguage()
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
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ministries-section section-pad"
      style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="container">

        {/* Section Header */}
        <div className="ministries-header reveal" style={{ marginBottom: '48px' }}>
          <p className="t-label" style={{ color: '#c8a96e', letterSpacing: '0.16em', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
            {t('activities.label')}
          </p>
          <h2 className="t-h2" style={{ color: '#ffffff', marginTop: '8px' }}>
            {t('activities.title')}
          </h2>
          <p className="t-body" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '720px', marginTop: '12px' }}>
            {t('activities.subtitle')}
          </p>
        </div>

        {/* Activities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {activitiesList.map((act) => (
            <div
              key={act.id}
              id={act.id}
              className="reveal"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '32px 28px',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s ease',
              }}
            >
              <span className="t-label" style={{ color: '#c8a96e', fontSize: '10.5px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
                {isTa ? 'ஏசிஐ பேராய செயல்பாடு' : 'ACI DIOCESE ACTIVITY'}
              </span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 600, marginTop: '10px', marginBottom: '14px', color: '#ffffff', lineHeight: 1.3 }}>
                {isTa ? act.titleTa : act.titleEn}
              </h3>
              <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.65', color: 'rgba(255,255,255,0.85)', marginBottom: '14px' }}>
                {isTa ? act.summaryTa : act.summaryEn}
              </p>
              <p className="t-body" style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                {isTa ? act.detailsTa : act.detailsEn}
              </p>

              {/* View Photo Album Link */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Link
                  to={`/gallery?cat=${encodeURIComponent(act.cat)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a96e' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff' }}
                >
                  <CameraIcon size={14} color="#c8a96e" />
                  <span>{isTa ? 'புகைப்பட ஆல்பங்களைக் காண்க' : `View ${act.cat} Photos & Albums`}</span>
                  <ArrowRightIcon size={12} color="#c8a96e" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
