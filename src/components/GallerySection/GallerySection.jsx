import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import galleryAlbumsData from '../../data/allGalleryAlbums.json'
import './GallerySection.css'

const categories = [
  { label: 'View All', value: 'All' },
  { label: 'Ordination', value: 'Ordination' },
  { label: 'Word Sharing Meet', value: 'Word Sharing Meet' },
  { label: 'Zonal Meet', value: 'Zonal Meet' },
  { label: 'Church Visit', value: 'Church Visit' },
  { label: 'Children Ministry', value: 'Children Ministry' },
  { label: 'Youth Ministry', value: 'Youth Ministry' },
  { label: 'Outreach & Relief', value: 'Others' },
  { label: 'Graduation', value: 'Graduation' },
  { label: 'Synod', value: 'Synod' },
  { label: 'Special Meetings', value: 'Others2' },
  { label: 'Branch Church', value: 'Others1' },
]

export default function GallerySection() {
  const sectionRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('cat')

  const [activeCat, setActiveCat] = useState('All')
  const [selectedImg, setSelectedImg] = useState(null)

  /* Update state when URL query cat changes */
  useEffect(() => {
    if (categoryParam) {
      setActiveCat(categoryParam)
    } else {
      setActiveCat('All')
    }
  }, [categoryParam])

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
      { threshold: 0.05 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const filteredAlbums = activeCat === 'All'
    ? galleryAlbumsData
    : galleryAlbumsData.filter(a =>
        a.category.toLowerCase().includes(activeCat.toLowerCase()) ||
        a.title.toLowerCase().includes(activeCat.toLowerCase())
      )

  const handleFilterClick = (catVal) => {
    setActiveCat(catVal)
    if (catVal === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ cat: catVal })
    }
  }

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="gallery-section section-pad"
      aria-label="Diocesan Photo Gallery"
    >
      <div className="container">

        <div className="gallery-header reveal">
          <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            OFFICIAL PHOTO GALLERY
          </p>
          <h2 className="t-headline" style={{ marginBottom: '20px' }}>
            65+ Photo Albums Across ACI Diocese Ministries
          </h2>

          {/* Category Filter Pills */}
          <div className="gallery-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterClick(cat.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeCat === cat.value ? '1px solid var(--color-black)' : '1px solid var(--color-divider-light)',
                  background: activeCat === cat.value ? 'var(--color-black)' : 'var(--color-white)',
                  color: activeCat === cat.value ? 'var(--color-white)' : 'var(--color-text-dark)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid reveal reveal-delay-1">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="gallery-item"
              onClick={() => setSelectedImg(album)}
            >
              <img
                src={`http://acidiocese.org/${album.img}`}
                alt={album.title}
                className="gallery-img"
                loading="lazy"
                onError={(e) => { e.target.src = '/img-about.jpg' }}
              />
              <div className="gallery-overlay">
                <span className="gallery-cat t-label" style={{ color: '#FFD700', fontWeight: 600 }}>
                  {album.count}
                </span>
                <h3 className="gallery-title">{album.title}</h3>
                <span style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>Category: {album.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImg && (
          <div className="lightbox-backdrop" onClick={() => setSelectedImg(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setSelectedImg(null)}>✕</button>
              <img
                src={`http://acidiocese.org/${selectedImg.img}`}
                alt={selectedImg.title}
                className="lightbox-img"
                onError={(e) => { e.target.src = '/img-about.jpg' }}
              />
              <div className="lightbox-caption">
                <span className="t-label" style={{ color: '#FFD700' }}>{selectedImg.count} • {selectedImg.category}</span>
                <h3 style={{ fontSize: '20px', marginTop: '4px' }}>{selectedImg.title}</h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
