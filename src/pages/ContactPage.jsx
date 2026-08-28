import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { LocationIcon, PhoneIcon, EmailIcon, CheckIcon, ArrowRightIcon } from '../components/Icons/SvgIcons'
import './ContactPage.css'

export default function ContactPage() {
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      alert(isTa ? 'உங்கள் பெயர், தொலைபேசி எண் மற்றும் ஜெப விண்ணப்பத்தை நிரப்பவும்.' : 'Please fill in your Name, Phone Number, and Prayer Request message.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="contact-page-wrap">
      
      {/* 1. Header Area */}
      <section className="contact-hero-section">
        <div className="contact-badge">
          <span>{isTa ? 'தொடர்பு கொள்ள' : 'CONTACT US'}</span>
        </div>
        <h1 className="contact-main-title">
          {isTa ? 'மத்திய பேராய அலுவலகத்தை தொடர்பு கொள்ளவும்' : 'Get In Touch With Central Diocesan Office'}
        </h1>
        <p className="contact-main-desc">
          {isTa
            ? 'ஜெப விண்ணப்பங்கள், சபை இணைப்புகள் மற்றும் ஆவிக்குரிய ஆலோசனைகளுக்கு எங்களை தொடர்பு கொள்ளவும்.'
            : 'For prayer requests, church affiliations, episcopal fellowship, and pastoral counsel.'}
        </p>
      </section>

      {/* 2. Curvy Information Cards Grid */}
      <div className="contact-cards-grid">
        
        {/* Card 1: Office Address */}
        <div className="contact-info-card">
          <div className="card-icon-bubble">
            <LocationIcon size={22} color="#9a7632" />
          </div>
          <span className="card-tag">{isTa ? 'மத்திய அலுவலக முகவரி' : 'CENTRAL OFFICE ADDRESS'}</span>
          <h3 className="card-heading">
            {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'Apostolic Council of India Diocese'}
          </h3>
          <p className="card-text">
            6/110, {isTa ? 'மேலப்பட்டி, ஹனுமந்தராயன்கோட்டை' : 'Melapatty, Hanumantharayan Kottai'},<br />
            {isTa ? 'திண்டுக்கல் மாவட்டம், தமிழ்நாடு, இந்தியா – 624002.' : 'Dindigul District, Tamil Nadu, India – 624002.'}
          </p>
        </div>

        {/* Card 2: Phone & Hours */}
        <div className="contact-info-card">
          <div className="card-icon-bubble">
            <PhoneIcon size={20} color="#9a7632" />
          </div>
          <span className="card-tag">{isTa ? 'தொலைபேசி & அலுவலக நேரம்' : 'OFFICE PHONE & HOURS'}</span>
          <h3 className="card-heading">
            <a href="tel:04512480100" className="card-highlight-link">0451-2480100</a>
          </h3>
          <p className="card-text">
            {isTa ? 'திங்கள் – சனி: 9:30 மு.ப – 1:30 பி.ப & 2:30 பி.ப – 6:30 பி.ப' : 'Mon – Sat: 9:30 AM – 1:30 PM & 2:30 PM – 6:30 PM'}<br />
            {isTa ? 'ஞாயிறு: ஆராதனை மற்றும் மாலை சிறப்பு கூட்டம்' : 'Sunday: Worship & Evening Service'}
          </p>
        </div>

        {/* Card 3: Official Emails */}
        <div className="contact-info-card">
          <div className="card-icon-bubble">
            <EmailIcon size={20} color="#9a7632" />
          </div>
          <span className="card-tag">{isTa ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'OFFICIAL EMAILS'}</span>
          <h3 className="card-heading">
            {isTa ? 'மின்னஞ்சல் தொடர்புகள்' : 'Direct Contacts'}
          </h3>
          <p className="card-text">
            <span className="card-email-row">
              {isTa ? 'பேராயர்: ' : 'Bishop: '} 
              <a href="mailto:rev.johnsondurai@gmail.com" className="card-highlight-link"><strong>rev.johnsondurai@gmail.com</strong></a>
            </span>
            <br />
            <span className="card-email-row">
              {isTa ? 'அறங்காவலர்: ' : 'Trustee: '} 
              <a href="mailto:rjdwonder@gmail.com" className="card-highlight-link"><strong>rjdwonder@gmail.com</strong></a>
            </span>
          </p>
        </div>

      </div>

      {/* 3. Modern Curvy Prayer Request Form Section */}
      <section className="contact-form-section">
        <div className="contact-form-card">
          <div className="contact-form-header">
            <div className="contact-badge">
              <span>{isTa ? 'ஜெபம் & ஐக்கியம்' : 'PRAYER & FELLOWSHIP'}</span>
            </div>
            <h2 className="contact-form-title">
              {isTa ? 'உங்கள் ஜெப விண்ணப்பங்களை அனுப்புங்கள்' : 'Send Us Your Prayer Requests'}
            </h2>
            <p className="contact-form-subtitle">
              {isTa
                ? 'பேராயத்தின் பேராயர்கள், போதகர்கள் மற்றும் ஜெபக்குழுவினர் உங்களுக்காக விசுவாசத்தோடு ஜெபிக்க காத்திருக்கிறோம்.'
                : 'Our bishops, pastors, and intercessory prayer team at ACI Diocese are here to stand with you in faith.'}
            </p>
          </div>

          {submitted ? (
            <div className="contact-success-box">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(200, 169, 110, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#9a7632' }}>
                <CheckIcon size={24} color="#9a7632" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: '#1a1a1a', margin: '0 0 10px' }}>
                {isTa ? 'உங்கள் ஜெப விண்ணப்பம் பெறப்பட்டது' : 'Thank you for sharing your prayer request'}
              </h3>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
                {isTa
                  ? 'எங்கள் பேராய ஜெபக்குழு உங்களுக்காக ஜெபித்து தொடர்ந்து தொடர்பில் இருப்பார்கள். தேவன் உங்களை நிறைவாக ஆசீர்வதிப்பாராக.'
                  : 'Our diocesan prayer ministry team will intercede for you and reach out soon. May God bless you abundantly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="contact-form-grid-2">
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    {isTa ? 'உங்கள் பெயர் *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isTa ? 'பெயரை உள்ளிடவும்' : 'Enter your name'}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="contact-form-input"
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    {isTa ? 'தொலைபேசி எண் *' : 'Your Phone No. *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={isTa ? 'தொலைபேசி எண்' : 'Enter your phone number'}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="contact-form-input"
                  />
                </div>
              </div>

              <div className="contact-form-grid-2">
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    {isTa ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    placeholder={isTa ? 'மின்னஞ்சல் (விருப்பத்தேர்வு)' : 'Enter your email (optional)'}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="contact-form-input"
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">
                    {isTa ? 'நகரம் / முகவரி' : 'City / Address'}
                  </label>
                  <input
                    type="text"
                    placeholder={isTa ? 'உங்கள் ஊர் / நகரம்' : 'Enter your city / address'}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="contact-form-input"
                  />
                </div>
              </div>

              <div className="contact-form-group" style={{ marginBottom: '24px' }}>
                <label className="contact-form-label">
                  {isTa ? 'ஜெப விண்ணப்பம் / செய்தி *' : 'Your Prayer Request / Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={isTa ? 'உங்கள் ஜெபக் குறிப்பை இங்கே விரிவாக எழுதவும்...' : 'Please write your prayer request or message here in detail...'}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="contact-form-textarea"
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="contact-submit-btn">
                  <span>{isTa ? 'ஜெப விண்ணப்பத்தை அனுப்பவும்' : 'Submit Prayer Request'}</span>
                  <ArrowRightIcon size={16} color="#ffffff" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}
