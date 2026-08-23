import { useState, useEffect, useRef } from 'react'
import './MediaSection.css'

const magazines = [
  { title: 'July - Sep 2023 Magazine', cover: '/migrated/b13db760ccb100c79bc210ca76a0d109.jpg', type: 'Diocese Magazine' },
  { title: 'April - June 2023 Magazine', cover: '/migrated/bf982890795ece9613693956213dab81.jpg', type: 'Diocese Magazine' },
  { title: 'January - March 2022 Magazine', cover: '/migrated/a6eb16f4dbe1831a2c519a5e2387244f.jpg', type: 'Diocese Magazine' },
  { title: 'October - December 2021 Magazine', cover: '/migrated/photo1.jpg', type: 'Diocese Magazine' },
]

const audioTracks = [
  { title: 'Worship Vol-1', subtitle: 'ACI Diocese Praise & Worship', src: '#' },
  { title: 'Worship Vol-2', subtitle: 'ACI Diocese Praise & Worship', src: '#' },
  { title: 'Worship Vol-3', subtitle: 'ACI Diocese Praise & Worship', src: '#' },
  { title: 'Worship Vol-4', subtitle: 'ACI Diocese Praise & Worship', src: '#' },
]

const videos = [
  { title: 'Children Ministry Worship', category: 'Ministry Video' },
  { title: 'Bishop Worship & Prayer', category: 'Bishop Service' },
  { title: 'Bishop Message to Diocese', category: 'Pastoral Message' },
]

const literature = [
  { title: 'Church The Body Of Christ', author: 'The Most Rev. S. Johnson Durai', lang: 'English' },
  { title: 'கிறிஸ்துவின் தெய்வத்துவம் (Deity of Christ)', author: 'The Most Rev. S. Johnson Durai', lang: 'Tamil' },
  { title: 'கிறிஸ்துவின் மனு அவதாரம் (Incarnation)', author: 'The Most Rev. S. Johnson Durai', lang: 'Tamil' },
  { title: 'கிறிஸ்துவின் கிரியைகள்-அலுவல்கள் (Works of Christ)', author: 'The Most Rev. S. Johnson Durai', lang: 'Tamil' },
]

export default function MediaSection() {
  const sectionRef = useRef(null)
  const [activeTab, setActiveTab] = useState('magazines')

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
      id="media"
      className="media-section section-pad"
      aria-label="Diocesan Media Hub"
    >
      <div className="container">

        {/* Section Header */}
        <div className="media-header reveal">
          <p className="t-label" style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            MEDIA &amp; PUBLICATIONS
          </p>
          <h2 className="t-headline" style={{ marginBottom: '24px' }}>
            Publications, Audio, Video &amp; Literature
          </h2>

          {/* Navigation Tabs */}
          <div className="media-tabs" role="tablist">
            <button
              id="magazines"
              className={`media-tab-btn ${activeTab === 'magazines' ? 'active' : ''}`}
              onClick={() => setActiveTab('magazines')}
            >
              Magazines
            </button>
            <button
              id="audio"
              className={`media-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              Audio Worship
            </button>
            <button
              id="video"
              className={`media-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              Video Sermons
            </button>
            <button
              id="literature"
              className={`media-tab-btn ${activeTab === 'literature' ? 'active' : ''}`}
              onClick={() => setActiveTab('literature')}
            >
              Literature &amp; Books
            </button>
          </div>
        </div>

        {/* Magazines Grid */}
        {activeTab === 'magazines' && (
          <div id="magazines" className="media-grid reveal reveal-delay-1">
            {magazines.map((mag, idx) => (
              <div key={idx} className="media-card">
                <img
                  src={mag.cover}
                  alt={mag.title}
                  className="media-card-img"
                  loading="lazy"
                  onError={(e) => { e.target.src = '/img-featured.jpg' }}
                />
                <div className="media-card-body">
                  <span className="media-tag t-label">{mag.type}</span>
                  <h3 className="media-card-title">{mag.title}</h3>
                  <a href="#download" className="media-link">
                    Download Magazine <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Audio Worship Grid */}
        {activeTab === 'audio' && (
          <div id="audio" className="media-grid reveal reveal-delay-1">
            {audioTracks.map((track, idx) => (
              <div key={idx} className="media-card media-audio-card" style={{ padding: '24px', background: 'var(--color-soft-gray)' }}>
                <span className="media-tag t-label">Audio Track {idx + 1}</span>
                <h3 className="media-card-title" style={{ marginTop: '8px', marginBottom: '4px' }}>{track.title}</h3>
                <p className="t-body" style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{track.subtitle}</p>
                <div style={{ padding: '12px', background: 'var(--color-white)', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}>
                  🎵 Audio Stream Player
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Sermons Grid */}
        {activeTab === 'video' && (
          <div id="video" className="media-grid reveal reveal-delay-1">
            {videos.map((vid, idx) => (
              <div key={idx} className="media-card" style={{ padding: '24px', background: 'var(--color-near-black)', color: 'var(--color-white)' }}>
                <span className="media-tag t-label" style={{ color: 'rgba(255,255,255,0.7)' }}>{vid.category}</span>
                <h3 className="media-card-title" style={{ color: 'var(--color-white)', marginTop: '8px', marginBottom: '16px' }}>{vid.title}</h3>
                <div style={{ height: '160px', background: '#222222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)' }}>
                  ▶ Play Video Message
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Literature Books Grid */}
        {activeTab === 'literature' && (
          <div id="literature" className="media-grid reveal reveal-delay-1">
            {literature.map((book, idx) => (
              <div key={idx} className="media-card" style={{ padding: '24px', border: '1px solid var(--color-divider-light)' }}>
                <span className="media-tag t-label">{book.lang} Book</span>
                <h3 className="media-card-title" style={{ marginTop: '8px', marginBottom: '8px' }}>{book.title}</h3>
                <p className="t-body" style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Author: {book.author}</p>
                <a href="#read-book" className="btn btn-dark" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Read Publication <span className="arrow">→</span>
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
