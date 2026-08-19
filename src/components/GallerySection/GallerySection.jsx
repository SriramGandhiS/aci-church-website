import { useState, useEffect, useRef } from 'react'
import './GallerySection.css'

const galleryImages = [
  { id: 1, src: '/migrated/01.jpg', title: 'ACI Diocese General Assembly & Convocation', category: 'Diocese Event' },
  { id: 2, src: '/migrated/02.jpg', title: 'Episcopal Ordination Ceremony', category: 'Ordination' },
  { id: 3, src: '/migrated/03.jpg', title: 'Regional Zonal Pastors Fellowship', category: 'Zonal Meet' },
  { id: 4, src: '/migrated/photo1.jpg', title: 'Outreach & Gospel Ministry', category: 'Outreach' },
  { id: 5, src: '/migrated/photo2.jpg', title: 'Word Sharing & Leadership Training', category: 'Training' },
  { id: 6, src: '/migrated/photo3.jpg', title: 'Prayer & Intercession Gathering', category: 'Prayer' },
  { id: 7, src: '/migrated/photo4.jpg', title: 'Children & VBS Ministry Training', category: 'Children' },
]

export default function GallerySection() {
  const sectionRef = useRef(null)
  const [selectedImg, setSelectedImg] = useState(null)

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
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
            PHOTO GALLERY
          </p>
          <h2 className="t-headline" style={{ marginBottom: '24px' }}>
            Life &amp; Ministries Across ACI Diocese
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid reveal reveal-delay-1">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="gallery-item"
              onClick={() => setSelectedImg(img)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="gallery-img"
                loading="lazy"
                onError={(e) => { e.target.src = '/img-about.jpg' }}
              />
              <div className="gallery-overlay">
                <span className="gallery-cat t-label">{img.category}</span>
                <h3 className="gallery-title">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImg && (
          <div className="lightbox-backdrop" onClick={() => setSelectedImg(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setSelectedImg(null)}>✕</button>
              <img src={selectedImg.src} alt={selectedImg.title} className="lightbox-img" />
              <div className="lightbox-caption">
                <span className="t-label" style={{ color: 'rgba(255,255,255,0.7)' }}>{selectedImg.category}</span>
                <h3 style={{ fontSize: '20px', marginTop: '4px' }}>{selectedImg.title}</h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
