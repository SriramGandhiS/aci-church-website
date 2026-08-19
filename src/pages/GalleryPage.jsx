import { useEffect } from 'react'
import GallerySection from '../components/GallerySection/GallerySection'

export default function GalleryPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div style={{ background: 'var(--color-near-black)', color: 'var(--color-white)', padding: '60px 0 40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p className="t-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>PHOTO GALLERY</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400 }}>
            Visual Journey Across ACI Diocese Ministries
          </h1>
        </div>
      </div>
      <GallerySection />
    </div>
  )
}
