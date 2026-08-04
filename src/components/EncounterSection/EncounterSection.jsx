import { useEffect, useRef } from 'react'
import './EncounterSection.css'

const encounterRows = [
  { label: 'Meet Jesus',            href: '#meet-jesus' },
  { label: 'Request Prayer',        href: '#request-prayer' },
  { label: 'Prayer for Healing',    href: '#prayer-healing' },
  { label: 'Find a Church',         href: '#find-church' },
]

export default function EncounterSection() {
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
      id="encounter"
      className="encounter-section section-pad"
      aria-label="Encounter Jesus"
    >
      <div className="container">
        <div className="encounter-inner">

          {/* Heading */}
          <h2 className="encounter-title t-section-serif reveal">
            Encounter Jesus
          </h2>

          {/* Subtext */}
          <p className="encounter-sub t-body reveal reveal-delay-1">
            Looking for prayer, spiritual guidance or a church community?<br />
            ACI Diocese is here to walk with you in faith.
          </p>

          {/* Action rows */}
          <ul className="encounter-list reveal reveal-delay-2" role="list">
            <li className="divider" />
            {encounterRows.map((row, idx) => (
              <li key={idx}>
                <a href={row.href} className="encounter-row">
                  <span className="enc-label">{row.label}</span>
                  <span className="enc-arrow" aria-hidden="true">→</span>
                </a>
                <div className="divider" />
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}
