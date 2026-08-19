import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './MinistriesSection.css'

const fullActivities = [
  {
    id: 'ordination',
    cat: 'Ordination',
    title: 'ORDINATION (பிரதிஷ்டை ஊழியம்)',
    summary: 'Bi-annual Episcopal Ordination of fivefold ministers (Apostles, Prophets, Pastors, Teachers, Evangelists) actively laboring in God\'s vineyard for at least 5 years.',
    details: 'Ordination takes place twice a year at the Central Diocesan Office upon confession of faith and confirmation of calling as per the Word of God and Indian law to exercise Christian Episcopal rights.',
  },
  {
    id: 'word-sharing',
    cat: 'Word Sharing Meet',
    title: 'WORD SHARING MEET (வார்த்தைப் பகிர்வு)',
    summary: 'Diocesan members gather at regular intervals to search, learn, and enrich themselves in the Word of God under key theological titles.',
    details: 'Equipping pastors and leaders with deep scriptural foundation, doctrinal clarity, and practical ministry tools.',
  },
  {
    id: 'zonal-meet',
    cat: 'Zonal Meet',
    title: 'ZONAL MEET (மண்டலக் கூட்டங்கள்)',
    summary: 'Regional fellowship gatherings of existing and prospective members of ACI Diocese across zones in Tamil Nadu and India.',
    details: 'Includes praise, worship, word teaching, and detailed synopsis of diocesan activities to encourage local church ministers.',
  },
  {
    id: 'church-visit',
    cat: 'Church Visit',
    title: 'CHURCH VISIT (சபை சந்திப்பு)',
    summary: 'Trustees of the board accompanied by District Overseers (DOS) visit member churches as Apostle Paul did.',
    details: 'Visiting local congregations to advise, equip, counsel, and pray with pastors and believers to advance the Kingdom of God.',
  },
  {
    id: 'children-ministry',
    cat: 'Children Ministry',
    title: 'CHILDREN MINISTRY & VBS (சிறுவர் ஊழியம்)',
    summary: 'Training Sunday School teachers, Children\'s Clubs, VBS directors & teacher training, and equipping children\'s ministers.',
    details: 'Equipping churches with resources, lesson materials, and specialized child evangelism techniques.',
  },
  {
    id: 'youth-ministry',
    cat: 'Youth Ministry',
    title: 'YOUTH MINISTRY (வாலிபர் ஊழியம்)',
    summary: '4-Pillar development training for youth leaders and young believers.',
    details: '1) Leadership Training, 2) Discipleship Training, 3) Personality Development, 4) Evangelism Skills.',
  },
  {
    id: 'outreach',
    cat: 'Outreach',
    title: 'OUTREACH & CRUSADES (புறசந்திப்பு)',
    summary: 'Forming 7-member Gospel teams out of Diocese members to reach unreached places in collaboration with local churches.',
    details: 'Methods: 1) Children Ministry by trained ministers, 2) Film Shows Ministry, 3) Street Preaching, 4) Tract Distribution, 5) Crusades.',
  },
]

export default function MinistriesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els?.length) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ministries"
      className="ministries-section section-pad"
      aria-label="Diocesan Activities and Ministries"
    >
      <div className="container">

        <p className="min-label t-label reveal">ACTIVITIES &amp; MINISTRIES</p>
        <h2 className="t-headline reveal" style={{ color: 'var(--color-white)', marginBottom: '40px' }}>
          Equipping Shepherds and Transforming Communities
        </h2>

        {/* Grid of All 7 Activities */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {fullActivities.map((act) => (
            <div
              key={act.id}
              id={act.id}
              className="reveal"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '28px',
                color: 'var(--color-white)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span className="t-label" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>ACI DIOCESE ACTIVITY</span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 600, marginTop: '8px', marginBottom: '12px' }}>
                {act.title}
              </h3>
              <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                {act.summary}
              </p>
              <p className="t-body" style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>
                {act.details}
              </p>

              {/* View Photo Album Link */}
              <div style={{ marginTop: 'auto' }}>
                <Link
                  to={`/gallery?cat=${encodeURIComponent(act.cat)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#FFD700',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  📷 View {act.cat} Photos &amp; Albums →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
