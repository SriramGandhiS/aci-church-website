import { useEffect, useRef } from 'react'
import './AboutSection.css'

/*
 * About section photograph — South Indian Tamil Nadu church community.
 * Replace /img-about.jpg with actual ACI Diocese photograph.
 */
const ABOUT_IMG = '/img-about.jpg'

export default function AboutSection() {
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section section-pad"
      aria-label="About ACI Diocese"
    >
      <div className="container">

        {/* Large editorial heading */}
        <h2 className="about-headline t-headline reveal">
          ACI Diocese is a Christ-centered community committed to faith,
          fellowship, service and transforming lives.
        </h2>

        {/* Two-column composition */}
        <div className="about-grid">

          {/* Left column */}
          <div className="about-left">
            <p className="about-statement t-statement reveal reveal-delay-1">
              Every believer is called to belong, grow in faith, and serve with purpose.
            </p>

            <p className="about-body t-body reveal reveal-delay-2">
              Apostolic Council of India Diocese serves churches and communities
              across Tamil Nadu with a commitment to Christian faith, spiritual
              growth, fellowship and service. We exist to equip, encourage and
              connect the body of Christ in Dindigul District and beyond.
            </p>

            <div className="about-buttons reveal reveal-delay-3">
              <a href="#about-aci" className="btn btn-dark">
                About ACI <span className="arrow">→</span>
              </a>
              <a href="#leadership" className="btn btn-dark" style={{ background: 'transparent', color: 'var(--color-black)', borderColor: 'rgba(0,0,0,0.3)' }}>
                Our Leadership <span className="arrow">→</span>
              </a>
            </div>
          </div>

          {/* Right column — photograph */}
          <div className="about-photo-wrap reveal reveal-delay-2">
            <img
              src={ABOUT_IMG}
              alt="South Indian Christian community gathered for worship in Tamil Nadu"
              className="about-photo"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
