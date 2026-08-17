import { useEffect, useRef } from 'react'
import './AboutSection.css'

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
      aria-label="Welcome to ACI Diocese"
    >
      <div className="container">

        {/* Large editorial heading */}
        <p className="t-label reveal" style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          WELCOME TO APOSTOLIC COUNCIL OF INDIA DIOCESE
        </p>

        <h2 className="about-headline t-headline reveal">
          A Christ-centered community committed to faith, fellowship, service, and transforming lives across India.
        </h2>

        {/* Two-column composition with Founder's Welcome */}
        <div className="about-grid">

          {/* Left column — Founder's Welcome Message */}
          <div className="about-left">
            <p className="about-statement t-statement reveal reveal-delay-1">
              &ldquo;Every ministry of this diocese will be a great blessing to every citizen of this Nation.&rdquo;
            </p>

            <div className="about-body t-body reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p>
                <strong>Welcome Message from Founder Bishop Rt. Rev. S. Johnson Durai:</strong>
              </p>
              <p>
                I, Rt. Rev. S. Johnson Durai, welcome you all in the name of our Lord and Saviour Jesus Christ through this website of the Apostolic Council of India Diocese. Every ministry of this diocese will be a great blessing to every citizen of this Nation.
              </p>
              <p>
                I welcome all those who are called and chosen by God to shoulder with the visions given by God to this Diocese.
              </p>

              {/* Tamil Welcome Text preserved from old website */}
              <div className="tamil-welcome-box" style={{ padding: '16px', background: 'var(--color-soft-gray)', borderLeft: '3px solid var(--color-black)', marginTop: '8px' }}>
                <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-dark)' }}>
                  அ க இ பேராயத்திற்கு உங்களை அன்புடன் வரவேற்கிறோம்
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-mid)' }}>
                  ஆண்டவராகிய இயேசுகிறிஸ்துவின் நாமத்தினாலே அப்போஸ்தலக் கவுன்சில் ஆஃப் இந்தியா பேராயத்திற்கு இந்த வலைதளத்தின் மூலமாக, பேரருட்திரு ச. ஜான்சன் துரை பேராயராகிய நான் உங்களை வரவேற்பதில் பெருமகிழ்ச்சியடைகிறேன். இந்தப் பேராயத்தின் மூலமாக நடைபெறுகிற ஒவ்வொரு ஊழியங்களும் தேசத்திலுள்ள ஒவ்வொரு குடிமகனுக்கும் மிகுந்த ஆசீர்வாதமாயிருக்கும்.
                </p>
              </div>
            </div>

            <div className="about-buttons reveal reveal-delay-3">
              <a href="#leadership" className="btn btn-dark">
                Diocese Leadership <span className="arrow">→</span>
              </a>
              <a href="#contact" className="btn btn-dark" style={{ background: 'transparent', color: 'var(--color-black)', borderColor: 'rgba(0,0,0,0.3)' }}>
                Contact Office <span className="arrow">→</span>
              </a>
            </div>
          </div>

          {/* Right column — Migrated Founder/Bishop Photograph */}
          <div className="about-photo-wrap reveal reveal-delay-2">
            <img
              src="/migrated/d2.png"
              alt="Bishop Rt. Rev. S. Johnson Durai — Founder of Apostolic Council of India Diocese"
              className="about-photo"
              loading="lazy"
              onError={(e) => { e.target.src = '/img-about.jpg' }}
            />
            <div style={{ padding: '12px 16px', background: 'var(--color-near-black)', color: 'var(--color-white)', fontSize: '13px' }}>
              <strong>Bishop Rt. Rev. S. Johnson Durai</strong> — Founder &amp; Senior Bishop, ACI Diocese
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
