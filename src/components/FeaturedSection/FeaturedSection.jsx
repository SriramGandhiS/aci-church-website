import './FeaturedSection.css'

/*
 * Featured section image — Migrated from ACI Diocese old website slider.
 */
const FEATURED_IMG = '/migrated/02.jpg'

export default function FeaturedSection() {
  return (
    <section
      id="featured"
      className="featured-section"
      aria-label="Latest Message from ACI Diocese"
    >
      {/* Background image */}
      <div className="featured-bg">
        <img
          src={FEATURED_IMG}
          alt="ACI Diocese annual gathering and worship"
          className="featured-img"
          loading="lazy"
          onError={(e) => { e.target.src = '/img-featured.jpg' }}
        />
        <div className="featured-overlay" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="featured-content container">
        <p className="feat-eyebrow t-label">Diocese Message &amp; Vision</p>
        <h2 className="feat-headline">Walking in Faith &amp; Kingdom Mission</h2>
        <a href="#about" className="btn btn-light feat-btn">
          Read Founder Message <span className="arrow">→</span>
        </a>
      </div>
    </section>
  )
}
