import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="footer" role="contentinfo">
      <div className="container">

        {/* Main footer grid */}
        <div className="footer-grid">

          {/* Column 1 — About */}
          <div className="footer-col footer-col-about">
            <div className="footer-logo">
              <img
                src="/aci-logo.png"
                alt="ACI Diocese"
                className="footer-logo-img"
                width="52"
                height="52"
              />
              <div>
                <p className="footer-logo-name">ACI Diocese</p>
                <p className="footer-logo-tag">Shepherding the Shepherds</p>
              </div>
            </div>
            <p className="footer-about-text">
              Apostolic Council of India Diocese — a Christ-centered community
              committed to faith, fellowship, service and transforming lives
              across Tamil Nadu and beyond.
            </p>
            <address className="footer-address">
              6/110, Melapatty,<br />
              Hanumantharayan Kottai,<br />
              Dindigul District,<br />
              Tamil Nadu, India – 624002
            </address>
          </div>

          {/* Column 2 — Connect */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">Connect</h3>
            <ul className="footer-links" role="list">
              <li><a href="#about" className="footer-link">About</a></li>
              <li><a href="#leadership" className="footer-link">Leadership</a></li>
              <li><a href="#ministries" className="footer-link">Ministries</a></li>
              <li><a href="#events" className="footer-link">Events</a></li>
              <li><a href="#churches" className="footer-link">Churches</a></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">Resources</h3>
            <ul className="footer-links" role="list">
              <li><a href="#messages" className="footer-link">Messages</a></li>
              <li><a href="#media" className="footer-link">Media</a></li>
              <li><a href="#prayer" className="footer-link">Prayer</a></li>
              <li><a href="#publications" className="footer-link">Publications</a></li>
              <li><a href="#downloads" className="footer-link">Downloads</a></li>
            </ul>
          </div>

          {/* Column 4 — More */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">More</h3>
            <ul className="footer-links" role="list">
              <li><a href="#give" className="footer-link">Give</a></li>
              <li><a href="#news" className="footer-link">News</a></li>
              <li><a href="#bible-school" className="footer-link">Bible School</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms of Use</a></li>
            </ul>
          </div>

          {/* Column 5 — Social */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">Social</h3>
            <ul className="footer-links" role="list">
              {/* 
                Social URLs pending — do not link to unverified accounts.
                Replace href values when official ACI Diocese profiles are confirmed.
              */}
              <li>
                <span className="footer-link footer-link-disabled" aria-label="Facebook (coming soon)">
                  Facebook
                </span>
              </li>
              <li>
                <span className="footer-link footer-link-disabled" aria-label="Instagram (coming soon)">
                  Instagram
                </span>
              </li>
              <li>
                <span className="footer-link footer-link-disabled" aria-label="YouTube (coming soon)">
                  YouTube
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="divider divider-dark" style={{ marginBottom: '28px' }} />
          <div className="footer-bottom-row">
            <p className="footer-copy">
              &copy; {year} Apostolic Council of India Diocese. All Rights Reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#privacy" className="footer-meta-link">Privacy</a>
              <span className="footer-sep">·</span>
              <a href="#terms" className="footer-meta-link">Terms</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
