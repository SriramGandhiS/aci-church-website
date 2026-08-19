import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import allAlbumsData from '../../data/allGalleryAlbumsWithPhotos.json'
import './AlbumPage.css'

const BASE = 'http://acidiocese.org/'

export default function AlbumPage() {
  const { uniq } = useParams()
  const navigate = useNavigate()
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const album = allAlbumsData.find(a => a.uniq === uniq)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [uniq])

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e) => {
      if (e.key === 'ArrowRight') setLightboxIdx(i => Math.min(i + 1, album.photos.length - 1))
      if (e.key === 'ArrowLeft') setLightboxIdx(i => Math.max(i - 1, 0))
      if (e.key === 'Escape') setLightboxIdx(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, album])

  if (!album) {
    return (
      <div style={{ paddingTop: '120px', textAlign: 'center', color: '#fff', minHeight: '100vh', background: '#0a0a0a' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Album not found</h2>
        <Link to="/gallery" style={{ color: '#c8a96e', textDecoration: 'none' }}>← Back to Gallery</Link>
      </div>
    )
  }

  return (
    <div className="album-page">
      {/* Header */}
      <div className="album-hero">
        <div className="album-hero-inner">
          <Link to="/gallery" className="album-back-link">← Back to Gallery</Link>
          <p className="album-category">{album.category}</p>
          <h1 className="album-title">{album.title}</h1>
          <p className="album-count">{album.photos.length} Photos</p>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="album-grid-container">
        <div className="album-grid">
          {album.photos.map((photo, idx) => (
            <div
              key={idx}
              className="album-photo-card"
              onClick={() => setLightboxIdx(idx)}
            >
              <img
                src={`${BASE}${photo}`}
                alt={`${album.title} - Photo ${idx + 1}`}
                className="album-photo-img"
                loading="lazy"
                onError={e => { e.target.style.opacity = '0.3' }}
              />
              <div className="album-photo-overlay">
                <span className="album-photo-num">{idx + 1} / {album.photos.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="album-lightbox" onClick={() => setLightboxIdx(null)}>
          <div className="album-lightbox-inner" onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button className="lb-close" onClick={() => setLightboxIdx(null)}>✕</button>

            {/* Prev */}
            {lightboxIdx > 0 && (
              <button className="lb-prev" onClick={() => setLightboxIdx(i => i - 1)}>‹</button>
            )}

            <img
              src={`${BASE}${album.photos[lightboxIdx]}`}
              alt={`${album.title} - Photo ${lightboxIdx + 1}`}
              className="lb-img"
              onError={e => { e.target.style.opacity = '0.3' }}
            />

            {/* Next */}
            {lightboxIdx < album.photos.length - 1 && (
              <button className="lb-next" onClick={() => setLightboxIdx(i => i + 1)}>›</button>
            )}

            <div className="lb-caption">
              <p className="lb-title">{album.title}</p>
              <p className="lb-counter">{lightboxIdx + 1} / {album.photos.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
