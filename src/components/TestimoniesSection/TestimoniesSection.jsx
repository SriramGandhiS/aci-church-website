import { useEffect, useRef } from 'react'
import './TestimoniesSection.css'

/*
 * Testimonies — Use only real testimonials supplied by ACI Diocese.
 * The entries below are clearly marked as PLACEHOLDER content for development.
 * Replace with actual testimonies from the client before going live.
 */
const testimonies = [
  {
    id: 1,
    quote:
      'Being part of ACI Diocese has transformed my life and the life of my family. The fellowship, prayer and discipleship I received here gave me a foundation I carry into every aspect of ministry.',
    name: '[Placeholder — Pastor Name, Location]',
    role: 'Placeholder testimony — replace with actual ACI Diocese member testimony',
  },
  {
    id: 2,
    quote:
      'ACI Diocese has been a home for our church. The training, the community, and the pastoral support we have received have strengthened our congregation beyond what we imagined.',
    name: '[Placeholder — Pastor Name, Location]',
    role: 'Placeholder testimony — replace with actual ACI Diocese member testimony',
  },
]

export default function TestimoniesSection() {
  const sectionRef   = useRef(null)
  const activeRef    = useRef(0)
  const indicatorRef = useRef(null)
  const contentRef   = useRef(null)

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
      id="testimonies"
      className="testimonies-section section-pad"
      aria-label="Testimonies"
    >
      <div className="container">

        <p className="test-label t-label reveal">Testimonies</p>

        <div className="test-grid">
          {testimonies.map((t) => (
            <blockquote key={t.id} className="test-card reveal reveal-delay-1">
              <p className="test-quote t-statement">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="test-footer">
                <cite className="test-name">{t.name}</cite>
                <span className="test-role t-body">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="test-cta reveal reveal-delay-2">
          <a href="#testimonies-all" className="btn btn-dark">
            Read More Stories <span className="arrow">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
