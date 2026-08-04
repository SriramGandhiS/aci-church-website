import './FeaturedSection.css'

/*
 * Featured section image — Tamil Nadu Christian conference/convention.
 * Replace /img-featured.jpg with actual ACI Diocese conference photograph.
 */
const FEATURED_IMG = '/img-featured.jpg'

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
          alt="ACI Diocese annual conference and worship gathering"
          className="featured-img"
          loading="lazy"
        />
        <div className="featured-overlay" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="featured-content container">
        <p className="feat-eyebrow t-label">Latest Message</p>
        <h2 className="feat-headline">Walking in Faith</h2>
        <a href="#messages" className="btn btn-light feat-btn">
          Watch Now <span className="arrow">→</span>
        </a>
      </div>
    </section>
  )
}
