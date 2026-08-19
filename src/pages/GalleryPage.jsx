import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import GallerySection from '../components/GallerySection/GallerySection'

export default function GalleryPage() {
  const [searchParams] = useSearchParams()
  const cat = searchParams.get('cat')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ paddingTop: '80px', background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: '#111',
        color: '#fff',
        padding: '56px 0 36px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
            PHOTO GALLERY
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, color: '#fff', lineHeight: 1.2 }}>
            {cat ? `Gallery — ${cat}` : 'Visual Journey Across ACI Diocese'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginTop: '10px' }}>
            65 albums · 1,500+ photos from all diocesan ministries
          </p>
        </div>
      </div>
      <GallerySection />
    </div>
  )
}
