import { useEffect, useRef } from 'react'
import './MinistriesSection.css'

/*
 * Ministry images — Tamil Nadu South Indian Christian prayer and worship.
 * Replace with actual ACI Diocese ministry photographs.
 */
const IMG_CIRCLE_1 = '/img-ministry1.jpg'
const IMG_CIRCLE_2 = '/img-ministry2.jpg'

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
      aria-label="Ministries"
    >
      <div className="container">

        {/* Label */}
        <p className="min-label t-label reveal">Ministries</p>

        {/* Main editorial layout */}
        <div className="min-layout">

          {/* Statement — floats around the imagery */}
          <div className="min-statement-col">
            <h2 className="min-headline reveal reveal-delay-1">
              There's a place for you in what God is doing through ACI.
            </h2>
            <div className="reveal reveal-delay-3">
              <a href="#ministries-list" className="btn btn-light min-cta">
                Connect With a Ministry <span className="arrow">→</span>
              </a>
            </div>
          </div>

          {/* Overlapping circular images */}
          <div className="min-circles reveal reveal-delay-2" aria-hidden="true">
            <div className="min-circle min-circle-1">
              <img
                src={IMG_CIRCLE_1}
                alt="ACI Diocese church congregation in worship"
                loading="lazy"
              />
            </div>
            <div className="min-circle min-circle-2">
              <img
                src={IMG_CIRCLE_2}
                alt="ACI Diocese prayer gathering Tamil Nadu"
                loading="lazy"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
