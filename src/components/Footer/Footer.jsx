import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="footer" role="contentinfo">
      <div className="container">

        {/* Main footer grid */}
        <div className="footer-grid">

          {/* Column 1 — About & Office */}
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
              Apostolic Council of India Diocese — serving churches, pastors, and communities across Tamil Nadu and India with commitment to Christian faith, fellowship, and service.
            </p>
            <address className="footer-address">
              <strong>Central Diocesan Office:</strong><br />
              6/110, Melapatty, Hanumantharayan Kottai,<br />
              Dindigul District, Tamil Nadu, India – 624002<br /><br />
              <strong>Office Phone:</strong> 0451-2480100<br />
              <strong>Working Hours:</strong> Mon – Sat: 9:30 AM – 1:30 PM &amp; 2:30 PM – 6:30 PM
            </address>
          </div>

          {/* Column 2 — Connect */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">Connect</h3>
            <ul className="footer-links" role="list">
              <li><a href="#about" className="footer-link">About Diocese</a></li>
              <li><a href="#about" className="footer-link">Founder Message</a></li>
              <li><a href="#schools" className="footer-link">Diocesan Board</a></li>
              <li><a href="#schools" className="footer-link">The Synod</a></li>
              <li><a href="#events" className="footer-link">Upcoming Events</a></li>
              <li><a href="#contact" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">Resources</h3>
            <ul className="footer-links" role="list">
              <li><a href="#encounter" className="footer-link">Prayer Requests</a></li>
              <li><a href="#featured" className="footer-link">Messages &amp; Sermons</a></li>
              <li><a href="#ministries" className="footer-link">Outreach &amp; Ministries</a></li>
              <li><a href="#schools" className="footer-link">Bible &amp; Synod Publications</a></li>
            </ul>
          </div>

          {/* Column 4 — More */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">More</h3>
            <ul className="footer-links" role="list">
              <li><a href="#give" className="footer-link">Opportunity to Sow / Partnership</a></li>
              <li><a href="#events" className="footer-link">Diocese Updates</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms of Use</a></li>
            </ul>
          </div>

          {/* Column 5 — Social */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">Social Media</h3>
            <ul className="footer-links" role="list">
              <li>
                <a
                  href="https://www.facebook.com/bishopacidiocese"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCbmbpSjkDBJR-59lYq-pIjQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/revjohnsondurai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="divider divider-dark" style={{ marginBottom: '28px' }} />
          <div className="footer-bottom-row">
            <p className="footer-copy">
              &copy; {year} Apostolic Council of India Diocese, Dindigul. All Rights Reserved.
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
