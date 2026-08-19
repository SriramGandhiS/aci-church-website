import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { getMediaUrl } from '../../utils/imageUrl'
import './InteractiveShowcase.css'

const HIGHLIGHT_ITEMS = [
  {
    titleEn: '23rd Episcopal Ordination Service',
    titleTa: '23-வது எபிஸ்கோபல் பிரதிஷ்டை ஆராதனை',
    catEn: 'Consecration & Calling',
    catTa: 'பிரதிஷ்டை ஊழியம்',
    count: '41 Photos',
    img: 'gallery/23rd Ordination 10.04.2024/4498769c2b5924c919c9336e04979875.jpg',
    link: '/gallery?cat=Ordination',
  },
  {
    titleEn: 'Madurai Zonal Office Dedication',
    titleTa: 'மதுரை மண்டல அலுவலக அர்ப்பணிப்பு',
    catEn: 'Regional Expansion',
    catTa: 'மண்டல வளர்ச்சி',
    count: '25 Photos',
    img: 'gallery/Madurai Zonal Office Dedication Service/7cc60a065180716a1dd0a3fe4db93be3.jpg',
    link: '/gallery?cat=Zonal Meet',
  },
  {
    titleEn: 'Youth Day 2022 Leadership Summit',
    titleTa: 'வாலிபர் தின தலைமைத்துவ மாநாடு 2022',
    catEn: 'Next Generation',
    catTa: 'வாலிபர் ஊழியம்',
    count: '50 Photos',
    img: 'gallery/YOUTH DAY 2022/ecb0b4a539fb2fa8e455481c94fc593c.jpg',
    link: '/gallery?cat=Youth Ministry',
  },
  {
    titleEn: 'Diocesan Church Visitation & Fellowship',
    titleTa: 'பேராய சபை சந்திப்பு & போதகர் ஐக்கியம்',
    catEn: 'Pastoral Care',
    catTa: 'சபை சந்திப்பு',
    count: '32 Photos',
    img: 'gallery/5th Church Visit/c50ad7cfc01b9dfaf710f5bf102b1851.jpg',
    link: '/gallery?cat=Church Visit',
  },
  {
    titleEn: 'Church Building Consecration Milestone',
    titleTa: 'புதிய ஆலய பிரதிஷ்டை வரலாற்று நிகழ்வு',
    catEn: 'Sanctuary Dedication',
    catTa: 'ஆலய பிரதிஷ்டை',
    count: '35 Photos',
    img: 'gallery/Church Dedication /f79744d5293e7c9c16935e976bffa844.jpg',
    link: '/gallery?cat=Others1',
  },
  {
    titleEn: 'Children VBS & Teacher Equipping',
    titleTa: 'சிறுவர் VBS & ஆசிரியர்கள் பயிற்சி முகாம்',
    catEn: 'Child Evangelism',
    catTa: 'சிறுவர் ஊழியம்',
    count: '42 Photos',
    img: 'gallery/VBS 2018/c57c7e9fa81e376829a69dc50471b34b.jpg',
    link: '/gallery?cat=Children Ministry',
  },
]

export default function InteractiveShowcase() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const sliderRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = sliderRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (direction) => {
    const el = sliderRef.current
    if (!el) return
    const scrollAmount = 360
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="interactive-showcase-section">
      <div className="container">

        {/* Section Header */}
        <div className="showcase-header">
          <div>
            <span className="showcase-badge">
              {isTa ? 'நேரடி புகைப்படத் தொகுப்பு' : 'INTERACTIVE SPOTLIGHT'}
            </span>
            <h2 className="showcase-title">
              {isTa ? 'பேராயத்தின் முக்கிய நிகழ்வுகள் & புகைப்படங்கள்' : 'Moments of Grace & Apostolic Ministry'}
            </h2>
          </div>

          <div className="showcase-nav-controls">
            <button
              onClick={() => scroll('left')}
              className={`showcase-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              className={`showcase-nav-btn ${!canScrollRight ? 'disabled' : ''}`}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>

        {/* Horizontal Sliding Carousel */}
        <div className="showcase-slider" ref={sliderRef}>
          {HIGHLIGHT_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="showcase-card"
            >
              <div className="showcase-img-wrap">
                <img
                  src={getMediaUrl(item.img)}
                  alt={item.titleEn}
                  className="showcase-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/img-about.jpg'
                  }}
                />
                <div className="showcase-img-scrim" />
                <span className="showcase-count-pill">{item.count}</span>
              </div>

              <div className="showcase-card-body">
                <span className="showcase-card-cat">
                  {isTa ? item.catTa : item.catEn}
                </span>
                <h3 className="showcase-card-title">
                  {isTa ? item.titleTa : item.titleEn}
                </h3>
                <span className="showcase-card-arrow">
                  {isTa ? 'ஆல்பத்தைக் காண்க →' : 'View Album →'}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
