import { useEffect, useRef } from 'react'
import { schoolPrograms } from '../../data/ministries'
import './SchoolsSection.css'

/*
 * Schools section image — Tamil Nadu South Indian Bible school / ministry training.
 * Replace /img-schools.jpg with actual ACI Diocese training photograph.
 */
const SCHOOL_IMG = '/img-schools.jpg'

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
      aria-label="Schools and Training"
    >
      <div className="container">

        {/* Header row */}
        <div className="schools-header">
          <p className="sch-label t-label reveal">Schools &amp; Training</p>
          <h2 className="sch-headline reveal reveal-delay-1">
            Equipping believers for ministry and leadership.
          </h2>
        </div>

        {/* Content grid */}
        <div className="schools-grid">

          {/* Program list */}
          <ul className="schools-list reveal reveal-delay-2" role="list">
            <div className="divider divider-dark" />
            {schoolPrograms.map((prog) => (
              <li key={prog.id}>
                <a href={prog.href} className="school-row">
                  <span className="school-num t-label">{prog.label}</span>
                  <div className="school-info">
                    <span className="school-title">{prog.title}</span>
                    <span className="school-desc t-body">{prog.description}</span>
                  </div>
                  <span className="school-arrow" aria-hidden="true">→</span>
                </a>
                <div className="divider divider-dark" />
              </li>
            ))}
          </ul>

          {/* Photograph */}
          <div className="schools-photo-wrap reveal reveal-delay-3">
            <img
              src={SCHOOL_IMG}
              alt="ACI Diocese ministry training and leadership development"
              className="schools-photo"
              loading="lazy"
            />
          </div>

        </div>

      </div>
    </section>
  )
}
