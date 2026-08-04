import { useEffect, useRef } from 'react'
import { upcomingEvents } from '../../data/events'
import './EventsSection.css'

export default function EventsSection() {
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
      id="events"
      className="events-section section-pad"
      aria-label="Upcoming Events"
    >
      <div className="container">

        {/* Section header */}
        <div className="events-header">
          <div>
            <p className="evt-label t-label reveal">Calendar &amp; Updates</p>
            <h2 className="evt-headline t-headline reveal reveal-delay-1">
              Upcoming Events
            </h2>
          </div>
          <div className="events-header-actions reveal reveal-delay-1">
            <a href="#updates" className="evt-updates-link">
              <span>Updates from ACI Diocese</span>
              <span className="arrow">→</span>
            </a>
            <a href="#calendar" className="btn btn-dark evt-all">
              All Events <span className="arrow">→</span>
            </a>
          </div>
        </div>

        {/* Event list */}
        <ul className="events-list reveal reveal-delay-2" role="list">
          <div className="divider" />
          {upcomingEvents.map((evt) => (
            <li key={evt.id}>
              <a href={evt.href} className="event-row">

                {/* Date block */}
                <div className="evt-date" aria-label={`${evt.day} ${evt.month} ${evt.year}`}>
                  <span className="evt-day">{evt.day}</span>
                  <span className="evt-month t-label">{evt.month}</span>
                </div>

                {/* Event info */}
                <div className="evt-info">
                  <span className="evt-title">{evt.title}</span>
                  <span className="evt-location t-body">{evt.location}</span>
                </div>

                {/* Type tag */}
                <span className="evt-type t-label">{evt.type}</span>

                {/* Arrow */}
                <span className="evt-arrow" aria-hidden="true">→</span>

              </a>
              <div className="divider" />
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
