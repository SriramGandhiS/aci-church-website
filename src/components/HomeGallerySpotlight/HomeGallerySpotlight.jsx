import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import allAlbumsData from '../../data/allGalleryAlbumsWithPhotos.json'
import './HomeGallerySpotlight.css'

const BASE = 'http://acidiocese.org/'

export default function HomeGallerySpotlight() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)

  // Pick 8 rich albums for the spotlight showcase
  const featuredAlbums = allAlbumsData.slice(0, 8)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal')
    if (!els?.length) return
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="home-spotlight-section section-pad">
      <div className="container">

        {/* Section Header */}
        <div className="spotlight-header reveal">
          <div className="spotlight-header-left">
            <p className="t-label spotlight-eyebrow">
              {t('homeSpotlight.label')}
            </p>
            <h2 className="spotlight-title">
              {t('homeSpotlight.title')}
            </h2>
            <p className="spotlight-subtitle">
              {t('homeSpotlight.subtitle')}
            </p>
          </div>

          <div className="spotlight-header-right">
            <Link to="/gallery" className="spotlight-view-all-btn">
              {t('homeSpotlight.exploreFull')}
            </Link>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="spotlight-grid reveal reveal-delay-1">
          {featuredAlbums.map((album) => (
            <Link
              key={album.uniq}
              to={`/gallery/album/${album.uniq}`}
              className="spotlight-card"
            >
              <div className="spotlight-card-img-wrapper">
                <img
                  src={`${BASE}${album.thumb}`}
                  alt={album.title}
                  className="spotlight-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/img-about.jpg'
                  }}
                />
                <div className="spotlight-card-badge">
                  {album.photos.length} Photos
                </div>
              </div>

              <div className="spotlight-card-info">
                <span className="spotlight-card-cat">{album.category}</span>
                <h3 className="spotlight-card-title">{album.title}</h3>
                <span className="spotlight-card-action">View Album Photos →</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
