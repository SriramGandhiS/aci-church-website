import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import EncounterSection from '../components/EncounterSection/EncounterSection'

export default function ContactPage() {
  const { lang, t } = useLanguage()
  const isTa = lang === 'ta'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ paddingTop: '80px', background: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <div style={{ background: '#111', color: '#ffffff', padding: '60px 0 40px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <p className="t-label" style={{ color: '#c8a96e', marginBottom: '8px', letterSpacing: '0.18em' }}>
            {isTa ? 'தொடர்பு கொள்ள' : 'CONTACT US'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 400, color: '#fff' }}>
            {isTa ? 'மத்திய பேராய அலுவலகத்தை தொடர்பு கொள்ளவும்' : 'Get In Touch With Central Diocesan Office'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginTop: '8px' }}>
            {isTa ? 'ஜெப விண்ணப்பங்கள், சபை இணைப்புகள் மற்றும் ஆவிக்குரிய ஆலோசனைகளுக்கு' : 'For prayer requests, church affiliations, and spiritual counsel'}
          </p>
        </div>
      </div>

      <div style={{ background: '#141414', padding: '48px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div>
            <span className="t-label" style={{ color: '#c8a96e', letterSpacing: '0.15em' }}>
              {isTa ? 'மத்திய அலுவலக முகவரி' : 'CENTRAL OFFICE ADDRESS'}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', marginBottom: '12px', color: '#ffffff' }}>
              {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'Apostolic Council of India Diocese'}
            </h3>
            <p className="t-body" style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.85)' }}>
              6/110, {isTa ? 'மேலப்பட்டி, ஹனுமந்தராயன்கோட்டை' : 'Melapatty, Hanumantharayan Kottai'},<br />
              {isTa ? 'திண்டுக்கல் மாவட்டம், தமிழ்நாடு, இந்தியா – 624002.' : 'Dindigul District, Tamil Nadu, India – 624002.'}
            </p>
          </div>
          <div>
            <span className="t-label" style={{ color: '#c8a96e', letterSpacing: '0.15em' }}>
              {isTa ? 'தொலைபேசி & அலுவலக நேரம்' : 'OFFICE PHONE & HOURS'}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', marginBottom: '8px' }}>
              <a href="tel:04512480100" style={{ color: '#ffffff', textDecoration: 'none' }}>0451-2480100</a>
            </h3>
            <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.7', color: 'rgba(255,255,255,0.85)' }}>
              {isTa ? 'திங்கள் – சனி: 9:30 மு.ப – 1:30 பி.ப & 2:30 பி.ப – 6:30 பி.ப' : 'Mon – Sat: 9:30 AM – 1:30 PM & 2:30 PM – 6:30 PM'}<br />
              {isTa ? 'ஞாயிறு: ஆராதனை மற்றும் மாலை சிறப்பு கூட்டம்' : 'Sunday: Worship & Evening Service'}
            </p>
          </div>
          <div>
            <span className="t-label" style={{ color: '#c8a96e', letterSpacing: '0.15em' }}>
              {isTa ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'OFFICIAL EMAILS'}
            </span>
            <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.8', marginTop: '8px', color: 'rgba(255,255,255,0.85)' }}>
              {isTa ? 'பேராயர் மின்னஞ்சல்:' : 'Bishop Email:'} <strong style={{ color: '#c8a96e' }}>rev.johnsondurai@gmail.com</strong><br />
              {isTa ? 'அறங்காவலர் மின்னஞ்சல்:' : 'Trustee Email:'} <strong style={{ color: '#c8a96e' }}>rjdwonder@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>

      <EncounterSection />
    </div>
  )
}
