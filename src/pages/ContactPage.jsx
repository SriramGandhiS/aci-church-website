import { useEffect } from 'react'
import EncounterSection from '../components/EncounterSection/EncounterSection'

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ paddingTop: '80px' }}>
      <div style={{ background: 'var(--color-near-black)', color: 'var(--color-white)', padding: '60px 0 40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <p className="t-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>CONTACT US</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400 }}>
            Get In Touch With Central Diocesan Office
          </h1>
        </div>
      </div>

      <div style={{ background: 'var(--color-white)', padding: '48px 0', borderBottom: '1px solid var(--color-divider-light)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div>
            <span className="t-label" style={{ color: 'var(--color-text-muted)' }}>CENTRAL OFFICE ADDRESS</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', marginBottom: '12px' }}>Apostolic Council of India Diocese</h3>
            <p className="t-body" style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--color-text-dark)' }}>
              6/110, Melapatty, Hanumantharayan Kottai,<br />
              Dindigul District, Tamil Nadu, India – 624002.
            </p>
          </div>
          <div>
            <span className="t-label" style={{ color: 'var(--color-text-muted)' }}>OFFICE PHONE &amp; HOURS</span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', marginBottom: '8px' }}>
              <a href="tel:04512480100" style={{ color: 'var(--color-black)', textDecoration: 'none' }}>0451-2480100</a>
            </h3>
            <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-text-dark)' }}>
              Mon – Sat: 9:30 AM – 1:30 PM &amp; 2:30 PM – 6:30 PM<br />
              Sunday: Worship &amp; Evening Service
            </p>
          </div>
          <div>
            <span className="t-label" style={{ color: 'var(--color-text-muted)' }}>OFFICIAL EMAILS</span>
            <p className="t-body" style={{ fontSize: '14px', lineHeight: '1.8', marginTop: '8px', color: 'var(--color-text-dark)' }}>
              Bishop Email: <strong>rev.johnsondurai@gmail.com</strong><br />
              Trustee Email: <strong>rjdwonder@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>

      <EncounterSection />
    </div>
  )
}
