import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { CameraIcon, ArrowRightIcon } from '../Icons/SvgIcons'

const activitiesList = [
  {
    id: 'ordination',
    title: 'ORDINATION (பிரதிஷ்டை ஊழியம்)',
    summary: 'Bi-annual Episcopal Ordination of fivefold ministers (Apostles, Prophets, Pastors, Teachers, Evangelists) actively laboring in God’s vineyard for at least 5 years.',
    details: 'Ordination takes place twice a year at the Central Diocesan Office upon confession of faith and confirmation of calling as per the Word of God and Indian law to exercise Christian Episcopal rights.',
    cat: 'Ordination',
  },
  {
    id: 'wordsharingmeet',
    title: 'WORD SHARING MEET (வார்த்தைப் பகிர்வு)',
    summary: 'Diocesan members gather at regular intervals to search, learn, and enrich themselves in the Word of God under key theological titles.',
    details: 'Equipping pastors and leaders with deep scriptural foundation, doctrinal clarity, and practical ministry tools.',
    cat: 'Word Sharing Meet',
  },
  {
    id: 'zonalmeet',
    title: 'ZONAL MEET (மண்டலக் கூட்டங்கள்)',
    summary: 'Regional fellowship gatherings of existing and prospective members of ACI Diocese across zones in Tamil Nadu and India.',
    details: 'Includes praise, worship, word teaching, and detailed synopsis of diocesan activities to encourage local church ministers.',
    cat: 'Zonal Meet',
  },
  {
    id: 'churchvisit',
    title: 'CHURCH VISIT (சபை சந்திப்பு)',
    summary: 'Trustees of the board accompanied by District Overseers (DOS) visit member churches as Apostle Paul did.',
    details: 'Visiting local congregations to advise, equip, counsel, and pray with pastors and believers to strengthen their ministries.',
    cat: 'Church Visit',
  },
  {
    id: 'childrenministry',
    title: 'CHILDREN MINISTRY & VBS (சிறுவர் ஊழியம்)',
    summary: 'Training Sunday School teachers, Children’s Clubs, VBS directors & teacher training, and equipping children’s ministers.',
    details: 'Conducting comprehensive Vacation Bible School (VBS) training camps and equipping leaders to reach the next generation.',
    cat: 'Children Ministry',
  },
  {
    id: 'youthministry',
    title: 'YOUTH MINISTRY (வாலிபர் ஊழியம்)',
    summary: '4-Pillar development training for youth leaders and young believers.',
    details: '1) Leadership Training, 2) Discipleship Training, 3) Personality Development, 4) Evangelism Skills.',
    cat: 'Youth Ministry',
  },
  {
    id: 'outreach',
    title: 'OUTREACH & MISSIONS (புறசந்திப்பு)',
    summary: 'Forming 7-member Gospel teams from Diocese members to reach unreached areas alongside local churches.',
    details: 'Reaching communities through children ministry, film shows, street preaching, tract distribution, and gospel crusades.',
    cat: 'Others',
  },
]

export default function MinistriesSection() {
  const { t } = useLanguage()
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
      style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="container">

        {/* Section Header */}
        <div className="ministries-header reveal" style={{ marginBottom: '48px' }}>
          <p className="t-label" style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', fontSize: '11px', textTransform: 'uppercase' }}>
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
              <span className="t-label" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                ACI DIOCESE ACTIVITY
              </span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 600, marginTop: '10px', marginBottom: '14px', color: '#ffffff', lineHeight: 1.3 }}>
                {act.title}
              </h3>
              <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.65', color: 'rgba(255,255,255,0.85)', marginBottom: '14px' }}>
                {act.summary}
              </p>
              <p className="t-body" style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                {act.details}
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
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  <CameraIcon size={14} color="#ffffff" />
                  <span>View {act.cat} Photos &amp; Albums</span>
                  <ArrowRightIcon size={12} color="#ffffff" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
