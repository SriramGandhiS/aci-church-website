import { useEffect, useRef } from 'react'
import './SchoolsSection.css'

const diocesePillars = [
  {
    id: 'd1',
    icon: '/migrated/d1.png',
    title: 'The Diocese',
    description: 'Apostolic Council of India Diocese serves churches and communities across Tamil Nadu and India with commitment to Christian faith and ministry.',
    href: '#about-diocese'
  },
  {
    id: 'd2',
    icon: '/migrated/d2.png',
    title: 'Founder & Leadership',
    description: 'Founded under the leadership of Bishop Rt. Rev. S. Johnson Durai to shepherd pastors and equip leaders for Kingdom work.',
    href: '#founder'
  },
  {
    id: 'd3',
    icon: '/migrated/d3.png',
    title: 'Diocesan Board',
    description: 'Seven committed trustees and board members guiding the administrative and spiritual mission of the diocese.',
    href: '#board'
  },
  {
    id: 'd4',
    icon: '/migrated/d4.png',
    title: 'The Synod',
    description: 'Comprising dedicated leaders, overseers, zonal heads, and district overseers (DOS) governing church administration and fellowship.',
    href: '#synod'
  }
]

export default function SchoolsSection() {
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
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="schools"
      className="schools-section section-pad"
      aria-label="Pillars of ACI Diocese"
    >
      <div className="container">

        {/* Header row */}
        <div className="schools-header">
          <p className="sch-label t-label reveal">Diocese Structure &amp; Pillars</p>
          <h2 className="sch-headline reveal reveal-delay-1">
            The Apostolic Council of India Diocese
          </h2>
        </div>

        {/* Content grid */}
        <div className="schools-grid">

          {/* Pillars list */}
          <ul className="schools-list reveal reveal-delay-2" role="list">
            <div className="divider divider-dark" />
            {diocesePillars.map((pillar) => (
              <li key={pillar.id}>
                <a href={pillar.href} className="school-row">
                  <img
                    src={pillar.icon}
                    alt={pillar.title}
                    style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#ffffff', borderRadius: '4px', padding: '4px' }}
                  />
                  <div className="school-info">
                    <span className="school-title">{pillar.title}</span>
                    <span className="school-desc t-body">{pillar.description}</span>
                  </div>
                  <span className="school-arrow" aria-hidden="true">→</span>
                </a>
                <div className="divider divider-dark" />
              </li>
            ))}
          </ul>

          {/* Migrated Slider Photograph */}
          <div className="schools-photo-wrap reveal reveal-delay-3">
            <img
              src="/migrated/01.jpg"
              alt="Apostolic Council of India Diocese Gathering"
              className="schools-photo"
              loading="lazy"
              onError={(e) => { e.target.src = '/img-schools.jpg' }}
            />
          </div>

        </div>

      </div>
    </section>
  )
}
