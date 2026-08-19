import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AboutSection from '../components/AboutSection/AboutSection'

export default function AboutPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div style={{ background: 'var(--color-near-black)', color: 'var(--color-white)', padding: '60px 0 40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p className="t-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>ABOUT US PAGE</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400 }}>
            About ACI Diocese, Founder &amp; Statement of Faith
          </h1>
        </div>
      </div>
      <AboutSection />
    </div>
  )
}
