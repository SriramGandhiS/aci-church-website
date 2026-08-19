import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import galleryAlbumsData from '../../data/allGalleryAlbumsWithPhotos.json'
import './GallerySection.css'

const BASE = 'http://acidiocese.org/'

/* Normalize: "WordSharingMeet" == "Word Sharing Meet" */
const normalize = s => s.toLowerCase().replace(/[\s\-_]+/g, '')

const FILTER_CATEGORIES = [
  { label: 'All', value: 'All' },
  { label: 'Ordination', value: 'Ordination' },
  { label: 'Word Sharing', value: 'Word Sharing Meet' },
  { label: 'Zonal Meet', value: 'Zonal Meet' },
  { label: 'Church Visit', value: 'Church Visit' },
  { label: 'Children Min.', value: 'Children Ministry' },
  { label: 'Youth Ministry', value: 'Youth Ministry' },
  { label: 'Synod', value: 'Synod' },
  { label: 'Graduation', value: 'Graduation' },
  { label: 'Outreach', value: 'Others' },
  { label: 'Special Services', value: 'Others1' },
  { label: 'Special Meetings', value: 'Others2' },
]

export default function GallerySection() {
  const sectionRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('cat') || 'All'
  const [activeCat, setActiveCat] = useState(categoryParam)

  useEffect(() => { setActiveCat(categoryParam) }, [categoryParam])

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els?.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.05 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [activeCat])

  const filteredAlbums = activeCat === 'All'
    ? galleryAlbumsData
    : galleryAlbumsData.filter(a => {
        const nc = normalize(a.category)
        const na = normalize(activeCat)
        return nc === na || nc.includes(na) || na.includes(nc)
      })

  const handleFilter = (val) => {
    setActiveCat(val)
    if (val === 'All') setSearchParams({})
    else setSearchParams({ cat: val })
  }

  return (
    <section ref={sectionRef} style={{ background: '#0a0a0a', color: '#fff', padding: '40px 0 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>

        {/* Stats row */}
        <div className="reveal" style={{ marginBottom: '24px' }}>
          <p style={{ color: '#c8a96e', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
            OFFICIAL PHOTO GALLERY
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 400, color: '#fff', marginBottom: '4px' }}>
            {activeCat === 'All'
              ? `${galleryAlbumsData.length} Albums · 1,500+ Photos`
              : `${filteredAlbums.length} Albums — ${activeCat}`}
          </h2>
          {activeCat !== 'All' && (
            <button
              onClick={() => handleFilter('All')}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', padding: '5px 14px', fontSize: '12px', cursor: 'pointer', marginTop: '8px', letterSpacing: '0.06em', borderRadius: '3px' }}
            >
              ← All Albums
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="reveal reveal-delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '32px' }}>
          {FILTER_CATEGORIES.map((cat, i) => {
            const isActive = cat.value === 'All'
              ? activeCat === 'All'
              : normalize(activeCat) === normalize(cat.value) ||
                normalize(cat.value).includes(normalize(activeCat)) ||
                normalize(activeCat).includes(normalize(cat.value))
            const count = cat.value === 'All'
              ? galleryAlbumsData.length
              : galleryAlbumsData.filter(a => normalize(a.category) === normalize(cat.value)).length
            return (
              <button
                key={i}
                onClick={() => handleFilter(cat.value)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  border: isActive ? '1.5px solid #c8a96e' : '1px solid rgba(255,255,255,0.2)',
                  background: isActive ? 'rgba(200,169,110,0.18)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#c8a96e' : 'rgba(255,255,255,0.75)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label} <span style={{ opacity: 0.6, fontWeight: 400 }}>({count})</span>
              </button>
            )
          })}
        </div>

        {/* Album Grid */}
        {filteredAlbums.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>No albums for this category yet</p>
            <button onClick={() => handleFilter('All')} style={{ color: '#c8a96e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              ← Show all albums
            </button>
          </div>
        ) : (
          <div className="gallery-grid reveal reveal-delay-1">
            {filteredAlbums.map(album => (
              <Link
                key={album.uniq}
                to={`/gallery/album/${album.uniq}`}
                className="gallery-item"
                style={{ textDecoration: 'none' }}
                title={album.title}
              >
                <img
                  src={`${BASE}${album.thumb}`}
                  alt={album.title}
                  className="gallery-img"
                  loading="lazy"
                  onError={e => {
                    e.target.onerror = null
                    e.target.style.opacity = '0.2'
                    e.target.style.background = '#222'
                  }}
                />
                <div className="gallery-overlay">
                  <span className="gallery-cat">
                    {album.photos.length} Photos · {album.category}
                  </span>
                  <h3 className="gallery-title">{album.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
