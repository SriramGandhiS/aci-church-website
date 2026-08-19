import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import MediaSection from '../components/MediaSection/MediaSection'

export default function MediaPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div style={{ background: 'var(--color-near-black)', color: 'var(--color-white)', padding: '60px 0 40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p className="t-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>MEDIA HUB</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400 }}>
            Magazines, Audio Worship, Videos &amp; Literature Books
          </h1>
        </div>
      </div>
      <MediaSection />
    </div>
  )
}
