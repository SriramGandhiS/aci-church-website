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
      {/* Clean Premium Dark Background */}
      <div className="featured-bg">
        <div className="featured-gradient-overlay" />
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
