import { useEffect, useRef } from 'react'
import './TestimoniesSection.css'

/*
 * Partner Testimonies — Ported from ACI Diocese Old Website
 */
const testimonies = [
  {
    id: 1,
    quote:
      'Since 2014, the day we affiliated with Apostolic Council of India Diocese, we are being blessed in different ways in our ministries and Churches. Our Church is lifted up in the City of Madurai by believing, teaching and strengthening through the real shepherding through the Word by the diocese.',
    name: 'Rev. Helen Daniel M.Th., Ph.D.',
    role: 'Episcopal Pastor, Good Shepherd Revival Churches, Paravai & Vilangudi, Madurai',
  },
  {
    id: 2,
    quote:
      'The Diocese is very helpful to our Church and our believers by its various activities like Children ministry training, Village ministry (VBS), Church visits to encourage the local churches affiliated with the diocese, and the valuable biblical counseling of the Bishop.',
    name: 'Episcopal Ministry Team',
    role: 'Good Shepherd Revival Churches, Madurai',
  },
]

export default function TestimoniesSection() {
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
      id="testimonies"
      className="testimonies-section section-pad"
      aria-label="Partner Testimonies"
    >
      <div className="container">

        <p className="test-label t-label reveal">Partner Testimonies</p>
        <h2 className="t-headline reveal" style={{ marginBottom: '40px', maxWidth: '640px' }}>
          Witnesses of God&apos;s blessings through ACI Diocese.
        </h2>

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

        <div className="test-cta reveal reveal-delay-2" style={{ marginTop: '40px' }}>
          <a href="#encounter" className="btn btn-dark">
            Partner With ACI Diocese <span className="arrow">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
