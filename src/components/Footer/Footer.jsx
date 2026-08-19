import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { lang, t } = useLanguage()
  const year = new Date().getFullYear()

  const isTa = lang === 'ta'

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
                <p className="footer-logo-name">{t('common.siteName')}</p>
                <p className="footer-logo-tag">{t('common.tagline')}</p>
              </div>
            </div>
            <p className="footer-about-text">
              {isTa
                ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம் — தமிழ்நாடு மற்றும் இந்தியா முழுவதும் உள்ள திருச்சபைகள், போதகர்கள் மற்றும் சமூகங்களுக்கு கிறிஸ்தவ விசுவாசம், ஐக்கியம் மற்றும் அர்ப்பணிப்புடன் சேவை செய்கிறது.'
                : 'Apostolic Council of India Diocese — serving churches, pastors, and communities across Tamil Nadu and India with commitment to Christian faith, fellowship, and service.'}
            </p>
            <address className="footer-address">
              <strong>{isTa ? 'மத்திய மறைமாவட்ட அலுவலகம்:' : 'Central Diocesan Office:'}</strong><br />
              6/110, {isTa ? 'மேலப்பட்டி, ஹனுமந்தராயன்கோட்டை' : 'Melapatty, Hanumantharayan Kottai'},<br />
              {isTa ? 'திண்டுக்கல் மாவட்டம், தமிழ்நாடு, இந்தியா – 624002' : 'Dindigul District, Tamil Nadu, India – 624002'}<br /><br />
              <strong>{isTa ? 'அலுவலக தொலைபேசி:' : 'Office Phone:'}</strong> 0451-2480100<br />
              <strong>{isTa ? 'வேலை நேரம்:' : 'Working Hours:'}</strong> {isTa ? 'திங்கள் – சனி: 9:30 மு.ப – 1:30 பி.ப & 2:30 பி.ப – 6:30 பி.ப' : 'Mon – Sat: 9:30 AM – 1:30 PM & 2:30 PM – 6:30 PM'}
            </address>
          </div>

          {/* Column 2 — Connect */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">{isTa ? 'இணைப்பு' : 'Connect'}</h3>
            <ul className="footer-links" role="list">
              <li><Link to="/about#about-diocese" className="footer-link">{isTa ? 'பேராயம் பற்றி' : 'About Diocese'}</Link></li>
              <li><Link to="/about#founder" className="footer-link">{isTa ? 'நிறுவனர் செய்தி' : 'Founder Message'}</Link></li>
              <li><Link to="/about#about-board" className="footer-link">{isTa ? 'நிர்வாகக் குழு' : 'Diocesan Board'}</Link></li>
              <li><Link to="/synod" className="footer-link">{isTa ? 'சினோட் ஆலோசனை மன்றம்' : 'The Synod'}</Link></li>
              <li><Link to="/gallery" className="footer-link">{isTa ? 'புகைப்பட ஆல்பங்கள்' : 'Photo Gallery'}</Link></li>
              <li><Link to="/contact" className="footer-link">{isTa ? 'தொடர்பு கொள்ள' : 'Contact Us'}</Link></li>
            </ul>
          </div>

          {/* Column 3 — Ministries */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">{isTa ? 'செயல்பாடுகள்' : 'Ministries'}</h3>
            <ul className="footer-links" role="list">
              <li><Link to="/activities#ordination" className="footer-link">{isTa ? 'பிரதிஷ்டை ஊழியம்' : 'Ordination Service'}</Link></li>
              <li><Link to="/activities#wordsharingmeet" className="footer-link">{isTa ? 'வார்த்தைப் பகிர்வு' : 'Word Sharing Meet'}</Link></li>
              <li><Link to="/activities#zonalmeet" className="footer-link">{isTa ? 'மண்டலக் கூட்டங்கள்' : 'Zonal Meet'}</Link></li>
              <li><Link to="/activities#churchvisit" className="footer-link">{isTa ? 'சபை சந்திப்பு' : 'Church Visit'}</Link></li>
              <li><Link to="/activities#childrenministry" className="footer-link">{isTa ? 'சிறுவர் ஊழியம்' : 'Children Ministry'}</Link></li>
              <li><Link to="/activities#youthministry" className="footer-link">{isTa ? 'வாலிபர் ஊழியம்' : 'Youth Ministry'}</Link></li>
            </ul>
          </div>

          {/* Column 4 — Resources & Partnership */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">{isTa ? 'பங்களிப்பு & ஊடகம்' : 'Partnership & Media'}</h3>
            <ul className="footer-links" role="list">
              <li><Link to="/partnership#prayer" className="footer-link">{isTa ? 'ஜெப விண்ணப்பங்கள்' : 'Prayer Requests'}</Link></li>
              <li><Link to="/partnership#partnertestimony" className="footer-link">{isTa ? 'பங்காளர் சாட்சி' : 'Partner Testimony'}</Link></li>
              <li><Link to="/partnership#opportunitytosow" className="footer-link">{isTa ? 'விதைப்பதற்கான வாய்ப்புகள்' : 'Opportunity to Sow'}</Link></li>
              <li><Link to="/media#magazines" className="footer-link">{isTa ? 'பேராய இதழ்கள்' : 'Diocesan Magazines'}</Link></li>
              <li><Link to="/media#audio" className="footer-link">{isTa ? 'ஆராதனைப் பாடல்கள்' : 'Worship Audio'}</Link></li>
              <li><Link to="/media#literature" className="footer-link">{isTa ? 'வேத புத்தகங்கள்' : 'Literature & Books'}</Link></li>
            </ul>
          </div>

          {/* Column 5 — Social */}
          <div className="footer-col">
            <h3 className="footer-col-title t-label">{isTa ? 'சமூக ஊடகம்' : 'Social Media'}</h3>
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
              &copy; {year} {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம், திண்டுக்கல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'Apostolic Council of India Diocese, Dindigul. All Rights Reserved.'}
            </p>
            <div className="footer-bottom-links">
              <Link to="/about#faith-statement" className="footer-meta-link">{isTa ? 'விசுவாச அறிக்கை' : 'Statement of Faith'}</Link>
              <span className="footer-sep">·</span>
              <Link to="/contact" className="footer-meta-link">{isTa ? 'தொடர்பு' : 'Contact'}</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
